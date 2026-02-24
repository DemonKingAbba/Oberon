export type TaskType = "URGENT" | "FIX_REQUIRED" | "INFO";
const drawingRegex = /\b[A-Z]{2,5}_[A-Z]{1,5}\d{3}-\d{3}\b/;
const urgentWords = ["urgent","asap","today","now","immediately","deadline"];
const fixWords = ["fix","change","revise","update","wrong","incorrect","missing","replace"];

export function parseText(subjectOrSender: string, text: string){
  const lower = (text || "").toLowerCase();
  const drawing = (text.match(drawingRegex) || [])[0] || null;
  const isUrgent = urgentWords.some(w => lower.includes(w));
  const isFix = fixWords.some(w => lower.includes(w));

  let type: TaskType = "INFO";
  if (isUrgent) type = "URGENT";
  else if (isFix) type = "FIX_REQUIRED";

  const title =
    type === "URGENT" ? `URGENT: ${subjectOrSender}` :
    type === "FIX_REQUIRED" ? `Fix Required: ${subjectOrSender}` :
    subjectOrSender;

  return { type, title, body: text, drawing };
}
