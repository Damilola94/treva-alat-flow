'use client';
import { Label } from '@/components/shared';
import { Button } from '@/components/ui/button';

const thead = [
  { label: 'S/N' },
  { label: 'Deliverable' },
  { label: 'Unit Price' },
  { label: 'Unit' },
  { label: 'Amount' },
];

const head = [
  { label: 'Payment schedule' },
  { label: 'Amount (NGN)' },
  { label: 'Due date' },
  { label: 'Status' },
];

export default function Page () {
  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !max-w-[700px] !mx-auto">
        <div className="border border-[#E5E5E5] rounded-xl p-4">
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <>
                <p>
                  <span className=" text-[#6B7280]">Project name:</span>{' '}
                  projectName
                </p>
                <p>
                  <span className=" text-[#6B7280]">Client name:</span>{' '}
                  clientName
                </p>
                <p>
                  <span className=" text-[#6B7280]">Client email:</span>
                  clientEmail
                </p>
                <p>
                  <span className=" text-[#6B7280]">Client phone number:</span>
                  clientPhoneNumber
                </p>
                <p>
                  <span className=" text-[#6B7280]">Start date:</span> startDate
                </p>
                <p>
                  <span className=" text-[#6B7280]">End date:</span> endDate
                </p>
              </>
            </div>
          </div>

          <div className="w-full text-left relative rounded-xl overflow-auto ">
            <div className="shadow-sm md:overflow-hidden ">
              <table className="border-collapse table-auto w-full app_table">
                <thead>
                  <tr className="app_table__tr">
                    {thead.map(({ label }) => (
                      <th key={label} className="app_table__tr__th">
                        <div className="app_table__tr__th__edit !bg-[#EFF1FE] !border-[#EFF1FE] ">
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2">deliverable</td>
                    <td className="px-4 py-2">NGN 32,000.00</td>
                    <td className="px-4 py-2">2</td>
                    <td className="px-4 py-2 font-bold">NGN 32,000.00</td>
                  </tr>
                </tbody>
              </table>

              <hr className="bg-[#E5E5E5] mt-6" />
            </div>
          </div>
          <div className="mt-6 text-right space-y-4">
            <div className="flex gap-5 justify-end">
              <span className="text-[#6B7280]">SUBTOTAL:</span>
              <span>NGN 64,000.00</span>
            </div>
            <div className="flex gap-5 justify-end font-bold text-lg">
              <span>TOTAL:</span>
              <span>NGN 64,000.00</span>
            </div>
          </div>

        </div>
          <div className="w-full text-left relative rounded-xl overflow-auto ">
            <div className="shadow-sm md:overflow-hidden ">
              <table className="border-collapse table-auto w-full app_table">
                <thead>
                  <tr className="app_table__tr">
                    {head.map(({ label }) => (
                      <th key={label} className="app_table__tr__th">
                        <div className="app_table__tr__th__edit !bg-[#EFF1FE] !border-[#EFF1FE] ">
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2">NGN 32,000.00</td>
                    <td className="px-4 py-2">20/05/2020</td>
                    <td className="px-4 py-2 font-bold">
                      <Label type="status" value='Due'/>
                    </td>
                  </tr>
                </tbody>
              </table>

              <hr className="bg-[#E5E5E5] mt-6" />
            </div>
          </div>
          <div className="mt-6 text-right">
          <Button
            size="lg"
            className=" py-3 px-12"
            backgroundColor="primary-blue-500"
          >
            Pay Due Amount
          </Button>
        </div>
      </div>
    </div>
  );
}
