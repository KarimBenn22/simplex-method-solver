"use client"
import { useRouter } from "next/navigation";
import AnimatedNumberInput from "../ui/animated-number-input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useRef, useState, useCallback } from "react";

const GenerateModel = () => {
    const router = useRouter();
    const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize' | null>(null);
    const variablesRef = useRef<number>(1);
    const constraintsRef = useRef<number>(1);

    const onChangeVariables = useCallback((val: number) => {
        console.log('Variables changed:', val);
        variablesRef.current = val;
    }, []);
    
    const onChangeConstraints = useCallback((val: number) => {
        console.log('Constraints changed:', val);
        constraintsRef.current = val;
    }, []);
    
    const handleGenerate = useCallback(() => {
        console.log('Generate clicked', {
            variables: variablesRef.current,
            constraints: constraintsRef.current,
            optimizationType
        });
        if (optimizationType) {
            router.push(`/?variables=${variablesRef.current}&constraints=${constraintsRef.current}&function=${optimizationType}`);
        }
    }, [router, optimizationType]);

    return (
        <div className="flex flex-col items-center w-full gap-6 mb-36 select-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">Generate Model</h1>
            <div className="w-full max-w-[640px] p-[2px] rounded-md">
                <Card className="flex flex-col gap-6 p-6 sm:p-8 md:p-10 w-full">
                    <div className="space-y-2">
                        <Label className="text-base">Variables</Label>
                        <AnimatedNumberInput min={1} initialValue={1} onChange={onChangeVariables} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base">Constraints</Label>
                        <AnimatedNumberInput min={1} initialValue={1} onChange={onChangeConstraints}/>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base">Function</Label>
                    </div>
                    <div className="flex w-full justify-center px-4 space-x-10">
                        <div
                            className={`rounded-full p-2 px-4 border-2 border-dashed flex items-center space-x-2 cursor-pointer transition-colors select-none
                                ${optimizationType === 'maximize'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-muted-foreground/50'}`}
                            onClick={() => setOptimizationType('maximize')}
                        >
                            <Checkbox
                                checked={optimizationType === 'maximize'}
                                onCheckedChange={() => setOptimizationType('maximize')}
                            />
                            <span>Maximize</span>
                        </div>
                        <div
                            className={`rounded-full p-2 px-4 border-2 border-dashed flex items-center space-x-2 transition-colors select-none cursor-not-allowed
                                ${optimizationType === 'minimize'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-muted-foreground/50'}`}
                            
                        >
                            <Checkbox
                                disabled
                                checked={optimizationType === 'minimize'}
                                onCheckedChange={() => setOptimizationType('minimize')}
                            />
                            <span>Minimize</span>
                        </div>
                    </div>
                    <Button
                        className="w-full mt-4 text-white font-[family-name:var(--font-geist-mono)]"
                        size={"lg"}
                        onClick={handleGenerate}
                        disabled={!optimizationType}
                    >
                        GENERATE
                    </Button>
                </Card>
            </div>
        </div>
    )
}

export default GenerateModel;