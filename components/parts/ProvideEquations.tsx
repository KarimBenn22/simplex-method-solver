"use client"
import Link from "next/link";
import { createRef, useMemo } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface ProvideEquationsProps {
    numberOfVariables: number
    numberOfConstraints: number
    fun: "maximize" | "minimize"
}

const ProvideEquations = ({ numberOfVariables, numberOfConstraints, fun }: ProvideEquationsProps) => {
    const router = useRouter();
    const objectiveRefs = useMemo(() =>
        Array.from({ length: numberOfVariables }, () => createRef<HTMLInputElement>())
        , [numberOfVariables]);

    const constraintRefs = useMemo(() =>
        Array.from({ length: numberOfConstraints }, () =>
            Array.from({ length: numberOfVariables }, () => createRef<HTMLInputElement>())
        )
        , [numberOfVariables, numberOfConstraints]);

    const constraintBRefs = useMemo(() =>
        Array.from({ length: numberOfConstraints }, () => createRef<HTMLInputElement>())
        , [numberOfConstraints]);

    const buildQueryString = () => {
        const objFunc = objectiveRefs
            .map((ref, i) => `x${i + 1}=${ref.current?.value || 0}`)
            .join('&');

        const constraints = constraintRefs
            .map((constraint, cIndex) => {
                const constraintVars = constraint
                    .map((ref, vIndex) => `C${cIndex + 1}_x${vIndex + 1}=${ref.current?.value || 0}`)
                    .join('&');
                const constraintB = `C${cIndex + 1}_b=${constraintBRefs[cIndex].current?.value || 0}`;
                return `${constraintVars}&${constraintB}`;
            })
            .join('&');
        console.log(objFunc, constraints);
        return `/solve?variables=${numberOfVariables}&constraints=${numberOfConstraints}&function=${fun}&calculate=true&${objFunc}&${constraints}`;
    };

    return (
        <div className="flex flex-col items-center w-full gap-6 mb-36 select-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">Provide Equations</h1>
            <div className="w-full max-w-[640px] p-[2px] rounded-md">
                <Card className="flex flex-col gap-6 p-6 sm:p-8 md:p-10 w-full justify-center items-center">
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-2">
                            {objectiveRefs.map((ref, variableIndex) => (
                                <div key={variableIndex} className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1 font-[family-name:var(--font-geist-mono)]">
                                        <Input
                                            ref={ref}
                                            className="w-14"
                                            type="number"
                                            defaultValue={0}
                                        />
                                        <span>x<sub>{variableIndex + 1}</sub></span>
                                    </div>
                                    {variableIndex < objectiveRefs.length - 1 && <span className="text-md text-blue-600">+</span>}
                                </div>
                            ))}
                        </div>

                        <h2 className="text-xl font-semibold text-center mt-4">Constraints</h2>
                        {constraintRefs.map((constraint, constraintIndex) => (
                            <div key={constraintIndex} className="flex space-x-2 items-center">
                                <div className="flex space-x-2">
                                    {constraint.map((ref, variableIndex) => (
                                        <div key={variableIndex} className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-1 font-[family-name:var(--font-geist-mono)]">
                                                <Input
                                                    ref={ref}
                                                    className="w-14"
                                                    type="number"
                                                    defaultValue={0}
                                                />
                                                <span>x<sub>{variableIndex + 1}</sub></span>
                                            </div>
                                            {variableIndex < constraint.length - 1 && <span className="text-md text-blue-600">+</span>}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-md text-blue-600">≤</span>
                                <Input
                                    ref={constraintBRefs[constraintIndex]}
                                    className="w-14"
                                    type="number"
                                    defaultValue={0}
                                    placeholder="b"
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        className="w-full mt-4 text-white font-[family-name:var(--font-geist-mono)]"
                        size={"lg"}
                        onClick={() => { router.push(buildQueryString()) }}
                    >
                        <Link href={buildQueryString()}>SOLVE</Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default ProvideEquations;