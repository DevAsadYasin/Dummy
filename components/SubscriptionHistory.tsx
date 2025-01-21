import React from 'react';
import { SubscriptionHistoryEntry } from '@/types/subscription';
import { Card } from "@/components/ui/card";
import { Calendar, DollarSign, RefreshCw, PlusCircle, Clock, CheckCircle2 } from 'lucide-react';

interface SubscriptionHistoryProps {
  history: SubscriptionHistoryEntry[];
}

export function SubscriptionHistory({ history }: SubscriptionHistoryProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'update':
        return <RefreshCw className="h-5 w-5" />;
      case 'create':
        return <PlusCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6 text-indigo-600" />
        <h3 className="text-2xl font-semibold text-indigo-600">
          Subscription History
        </h3>
      </div>

      {history.length === 0 ? (
        <Card className="p-6 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-dashed border-2 border-indigo-200">
          <p className="text-indigo-600">No subscription history available.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((entry) => (
            <Card key={entry.id} className="group hover:shadow-md transition-all duration-300 bg-white border border-indigo-100">
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 
                                group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 
                                group-hover:text-white transition-all duration-300">
                    {getActionIcon(entry.action_type)}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-indigo-700">
                      {entry.action_type}
                    </h4>
                    <p className="text-sm text-indigo-600">
                      {entry.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-indigo-500 justify-center">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {formatDate(entry.action_date)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-indigo-500 justify-center">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    ${entry.payment.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Success</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

