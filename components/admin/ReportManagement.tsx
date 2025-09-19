import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { Report } from '../../types.ts';
import Icon from '../Icon.tsx';

const ReportManagement: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: number, status: Report['status']) => {
        try {
            await api.updateAdminReportStatus(reportId, status);
            fetchReports();
        } catch (error) {
            console.error("Failed to update report status:", error);
        }
    };
    
    const getStatusColor = (status: Report['status']) => ({
        pending: 'bg-yellow-500/20 text-yellow-300',
        resolved: 'bg-green-500/20 text-green-300',
        dismissed: 'bg-gray-500/20 text-gray-400'
    }[status]);

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="font-bold mb-4 text-lg">Report Management</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                     <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-3">Reported Entity</th>
                            <th className="px-4 py-3">Reporter</th>
                            <th className="px-4 py-3">Reason</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                     <tbody>
                        {reports.map(report => (
                            <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                <td className="px-4 py-3 font-medium">
                                    <p>{(report as any).reported_username || (report as any).reported_post_caption || report.reported_entity_id}</p>
                                    <p className="text-xs text-gray-400 uppercase">{report.entity_type}</p>
                                </td>
                                <td className="px-4 py-3">{(report as any).reporter_username}</td>
                                <td className="px-4 py-3">{report.reason}</td>
                                <td className="px-4 py-3">{new Date(report.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-1">
                                    {report.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleUpdateStatus(report.id, 'resolved')} className="p-1 text-xs">Resolve</button>
                                            <button onClick={() => handleUpdateStatus(report.id, 'dismissed')} className="p-1 text-xs">Dismiss</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {isLoading && <p className="text-center py-4">Loading reports...</p>}
                 {!isLoading && reports.length === 0 && <p className="text-center py-4">No reports found.</p>}
            </div>
        </div>
    );
};

export default ReportManagement;