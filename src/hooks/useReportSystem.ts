import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type TimeRange = "7d" | "30d" | "90d" | "1y";
export type ReportType =
  | "comprehensive"
  | "compliance"
  | "api_performance"
  | "user_analytics"
  | "business_growth"
  | "regulatory_summary";

export function useReportSystem() {
  async function invoke(action: string, body: Record<string, any>) {
    const { data, error } = await supabase.functions.invoke("report-system", {
      body: { action, ...body },
    });
    if (error) {
      console.error("report-system error", error);
      toast({
        title: "Erro no sistema de relatórios",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
    return data as any;
  }

  async function getTemplates() {
    return invoke("get_templates", {});
  }

  async function generateReport(params: {
    reportType: ReportType;
    timeRange?: TimeRange;
    format?: "json" | "pdf" | "excel";
    filters?: Record<string, any>;
  }) {
    const { reportType, timeRange = "30d", format = "json", filters = {} } = params;
    const res = await invoke("generate_report", {
      reportType,
      timeRange,
      format,
      filters,
    });
    toast({ title: "Relatório gerado", description: "Seu relatório está pronto." });
    return res;
  }

  async function getInsights(params: {
    reportType: ReportType;
    timeRange?: TimeRange;
    filters?: Record<string, any>;
  }) {
    const { reportType, timeRange = "30d", filters = {} } = params;
    return invoke("get_insights", { reportType, timeRange, filters });
  }

  async function scheduleReport(params: {
    reportType: ReportType;
    format?: "json" | "pdf" | "excel";
    filters?: Record<string, any>;
  }) {
    const { reportType, format = "pdf", filters = {} } = params;
    const res = await invoke("schedule_report", { reportType, format, filters });
    toast({ title: "Relatório agendado", description: "Agendamento criado com sucesso." });
    return res;
  }

  async function exportData(params: {
    format?: "json" | "pdf" | "excel";
    filters?: Record<string, any>;
  }) {
    const { format = "json", filters = {} } = params;
    const res = await invoke("export_data", { format, filters });
    toast({ title: "Exportação concluída", description: "Arquivo pronto para download." });
    return res;
  }

  function downloadJSON(data: any, filename: string) {
    const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { getTemplates, generateReport, getInsights, scheduleReport, exportData, downloadJSON };
}
