import GenerateModel from "@/components/parts/GenerateModel";
import ProvideEquations from "@/components/parts/ProvideEquations";
import { validateSearchParams } from "@/lib/utils";
import { redirect } from "next/navigation";

export interface paramsType {
  variables: number,
  constraints: number,
  function: "maximize" | "minimize"

}


export default function Home({ searchParams }: { searchParams: paramsType }) {
  if (searchParams.constraints && searchParams.function && searchParams.variables && !validateSearchParams(searchParams)) {
    redirect('/');
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-7xl mx-auto">
        {
          searchParams.constraints && searchParams.function && searchParams.variables && validateSearchParams(searchParams) ? (
            <ProvideEquations numberOfVariables={searchParams.variables} numberOfConstraints={searchParams.constraints} fun={searchParams.function} />
          ) : (
            <GenerateModel />
          )
        }
      </div>
    </main>
  );
}
