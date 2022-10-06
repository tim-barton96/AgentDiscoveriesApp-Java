package org.softwire.training.models;

import java.time.LocalDateTime;

public class ReportBase {

    private int reportId;
    private int status;
    private LocalDateTime reportTime; // Always UTC in the DB
    private String reportBody;
    private int agentId;

    public int getReportId() {
        return reportId;
    }

    public void setReportId(int reportId) {
        this.reportId = reportId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        if(status < 0 || status > 100) {
            throw new IllegalArgumentException(status + "is not a valid status.");
        }
        this.status = status;
    }

    public LocalDateTime getReportTime() {
        return reportTime;
    }

    public void setReportTime(LocalDateTime reportTime) {
        this.reportTime = reportTime;
    }

    public String getReportBody() {
        return reportBody;
    }

    public void setReportBody(String reportBody) {
        this.reportBody = reportBody;
    }

    public int getAgentId() { return agentId; }

    public void setAgentId(int agentId) { this.agentId = agentId; }
}
