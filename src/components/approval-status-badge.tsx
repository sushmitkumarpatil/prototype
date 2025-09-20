'use client';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

type Approval = 'PENDING' | 'APPROVED' | 'REJECTED';

export function ApprovalStatusBadge({ status }: { status: Approval }) {
  const config =
    status === 'APPROVED'
      ? {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
          label: 'Approved',
          tip: 'This item is approved and visible to everyone.',
        }
      : status === 'REJECTED'
      ? {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
          label: 'Rejected',
          tip: 'This item was rejected by an administrator.',
        }
      : {
          color: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          label: 'Pending',
          tip: 'Awaiting admin approval. Only you and admins can see this.',
        };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.color} inline-flex items-center`}> 
            {config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ApprovalStatusBadge;


