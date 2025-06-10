
-- Enable Row Level Security on missing tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own user record" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for projects table
CREATE POLICY "Users can view all projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update projects they're involved in" ON public.projects FOR UPDATE USING (true);

-- Create RLS policies for consultants table
CREATE POLICY "Users can view all consultants" ON public.consultants FOR SELECT USING (true);
CREATE POLICY "Consultants can update own profile" ON public.consultants FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = profile_id);
CREATE POLICY "Users can create consultant profiles" ON public.consultants FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = profile_id);

-- Create RLS policies for companies table
CREATE POLICY "Users can view all companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Companies can update own profile" ON public.companies FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = profile_id);
CREATE POLICY "Users can create company profiles" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = profile_id);

-- Create RLS policies for laboratories table
CREATE POLICY "Users can view all laboratories" ON public.laboratories FOR SELECT USING (true);
CREATE POLICY "Laboratories can update own profile" ON public.laboratories FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = profile_id);
CREATE POLICY "Users can create laboratory profiles" ON public.laboratories FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = profile_id);
