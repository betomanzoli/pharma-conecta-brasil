-- Criar função para analytics do dashboard
CREATE OR REPLACE FUNCTION public.get_analytics_data(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE,
  user_filter TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH analytics_data AS (
    -- Métricas gerais
    SELECT 
      'overview' as type,
      JSON_BUILD_OBJECT(
        'total_users', (SELECT COUNT(*) FROM profiles WHERE created_at >= start_date AND created_at <= end_date),
        'total_sessions', (SELECT COUNT(*) FROM mentorship_sessions WHERE created_at >= start_date AND created_at <= end_date),
        'total_projects', (SELECT COUNT(*) FROM projects WHERE created_at >= start_date AND created_at <= end_date),
        'total_companies', (SELECT COUNT(*) FROM companies WHERE created_at >= start_date AND created_at <= end_date),
        'total_revenue', (SELECT COALESCE(SUM(price), 0) FROM mentorship_sessions WHERE status = 'completed' AND created_at >= start_date AND created_at <= end_date)
      ) as data
    
    UNION ALL
    
    -- Dados de engajamento por dia
    SELECT 
      'engagement' as type,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'date', daily_stats.date,
          'sessions', daily_stats.sessions,
          'new_users', daily_stats.new_users,
          'active_projects', daily_stats.active_projects
        ) ORDER BY daily_stats.date
      ) as data
    FROM (
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN table_name = 'mentorship_sessions' THEN 1 END) as sessions,
        COUNT(CASE WHEN table_name = 'profiles' THEN 1 END) as new_users,
        COUNT(CASE WHEN table_name = 'projects' THEN 1 END) as active_projects
      FROM (
        SELECT created_at, 'mentorship_sessions' as table_name FROM mentorship_sessions WHERE created_at >= start_date AND created_at <= end_date
        UNION ALL
        SELECT created_at, 'profiles' as table_name FROM profiles WHERE created_at >= start_date AND created_at <= end_date
        UNION ALL
        SELECT created_at, 'projects' as table_name FROM projects WHERE created_at >= start_date AND created_at <= end_date
      ) combined_data
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    ) daily_stats
    
    UNION ALL
    
    -- Segmentação de usuários
    SELECT 
      'user_segments' as type,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'segment', segment_data.user_type,
          'users', segment_data.user_count,
          'percentage', ROUND((segment_data.user_count * 100.0 / total_users.total), 1)
        )
      ) as data
    FROM (
      SELECT 
        user_type,
        COUNT(*) as user_count
      FROM profiles 
      WHERE created_at >= start_date AND created_at <= end_date
      GROUP BY user_type
    ) segment_data
    CROSS JOIN (
      SELECT COUNT(*) as total FROM profiles WHERE created_at >= start_date AND created_at <= end_date
    ) total_users
    
    UNION ALL
    
    -- Análise de receita por mês
    SELECT 
      'revenue_analysis' as type,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'month', TO_CHAR(revenue_data.month, 'Mon'),
          'revenue', revenue_data.total_revenue,
          'sessions', revenue_data.total_sessions,
          'avg_price', revenue_data.avg_price
        ) ORDER BY revenue_data.month
      ) as data
    FROM (
      SELECT 
        DATE_TRUNC('month', scheduled_at) as month,
        SUM(price) as total_revenue,
        COUNT(*) as total_sessions,
        AVG(price) as avg_price
      FROM mentorship_sessions 
      WHERE status = 'completed' 
        AND scheduled_at >= start_date 
        AND scheduled_at <= end_date
      GROUP BY DATE_TRUNC('month', scheduled_at)
    ) revenue_data
    
    UNION ALL
    
    -- Top mentores por rating
    SELECT 
      'top_mentors' as type,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'name', COALESCE(p.first_name || ' ' || p.last_name, 'Mentor'),
          'rating', m.average_rating,
          'sessions', m.total_sessions,
          'specialty', m.specialty[1]
        ) ORDER BY m.average_rating DESC, m.total_sessions DESC
      ) as data
    FROM mentors m
    JOIN profiles p ON m.profile_id = p.id
    WHERE m.is_active = true
    LIMIT 10
  )
  
  SELECT JSON_OBJECT_AGG(type, data) INTO result
  FROM analytics_data;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;