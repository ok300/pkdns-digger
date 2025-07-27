// No records found component
import { Library } from "lucide-react";

export const NoRecordsFound = () => (
  <div className="flex-1 flex items-center justify-center p-8 min-h-[50vh]">
    <div className="w-full max-w-4xl rounded-lg bg-zinc-900 p-12">
      <div className="text-center">
        <div className="text-gray-400 text-lg mb-2">No Records Found</div>
        <div className="text-gray-500 text-sm">This pubky does not have any PKARR records</div>
        <div className="flex justify-center my-8">
          <Library className="w-24 h-24 text-gray-500" strokeWidth={1} />
        </div>
      </div>
    </div>
  </div>
);