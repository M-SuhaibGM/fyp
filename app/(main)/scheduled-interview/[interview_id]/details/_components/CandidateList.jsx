"use client";
import moment from "moment/moment";
import React from "react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";
import { SearchX, Trophy, Download, UserCheck, FileSpreadsheet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CandidateList({ candidate }) {
  const getAverageScore = (feedbackData) => {
    if (!feedbackData?.feedback?.rating) return 0;
    const r = feedbackData.feedback.rating;
    const avg = (r.technicalSkills || 0) + (r.communication || 0) + (r.problemSolving || 0) + (r.experience || 0);
    return avg / 4;
  };

  const rankedCandidates = candidate ? [...candidate].sort((a, b) =>
    getAverageScore(b.feedback) - getAverageScore(a.feedback)
  ) : [];

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Candidate Ranking Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${moment().format("LL")}`, 14, 30);

    const tableRows = rankedCandidates.map((c, index) => [
      index + 1,
      c.userName.toUpperCase(),
      c.userEmail,
      getAverageScore(c.feedback).toFixed(1) + "/10",
      moment(c.created_at).format("DD MMM, YYYY")
    ]);

    // Using the internal autoTable method that the plugin adds to doc
    // We use (doc as any) or ignore if using JS to avoid linting errors
    autoTable(doc, {
      startY: 35,
      head: [['Rank', 'Full Name', 'Email Address', 'AI Score', 'Interview Date']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
    });

    doc.save("Ranking_Report.pdf");
  };
  if (!candidate) return <CandidateListSkeleton />;

  if (candidate.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-500 bg-white mt-5">
        <SearchX className="w-10 h-10 mb-2" />
        <h3 className="text-lg font-medium">No Candidate Records</h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-6">
        <div>
          <h2 className="font-bold text-2xl text-slate-800 tracking-tight">
            Candidates
          </h2>
          <p className="text-sm text-slate-500">Total {candidate?.length} participants</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center shadow-sm">
              <Trophy className="h-4 w-4" /> Generate Ranking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileSpreadsheet className="text-green-600" />
                Performance Ranking Sheet
              </DialogTitle>
              <DialogDescription>
                Review and export candidate performance data sorted by AI evaluation.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-auto my-4 border rounded-md">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">AI Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedCandidates.map((c, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </TableCell>
                      <TableCell className="font-medium uppercase">{c.userName}</TableCell>
                      <TableCell className="text-slate-500">{c.userEmail}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {getAverageScore(c.feedback).toFixed(1)}/10
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button onClick={downloadPDF} variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
                <Download className="h-4 w-4" /> Export as PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {candidate.map((c, ind) => (
          <div key={ind} className="p-4 flex justify-between items-center bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full">
                {c.userName[0].toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 uppercase text-sm tracking-wide">{c?.userName}</h2>
                <p className="text-xs text-slate-400">{moment(c?.created_at).format("DD MMM, YYYY")}</p>
              </div>
            </div>
            <CandidateFeedbackDialog candidate={c} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateListSkeleton() {
  return (
    <div className="mt-10 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
    </div>
  );
}

export default CandidateList;