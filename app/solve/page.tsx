import { simplexUrlParams, useSimplex } from "@/hooks/useSimplex";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Solve({searchParams}: {searchParams: simplexUrlParams}) {
    const {tables} = useSimplex(searchParams);
    
    // Keep track of initial non-base variables (including x and s variables)
    const initialNonBaseVariables = [
        ...tables[0].nonBaseVariables, 
        ...tables[0].baseVariables.filter(v => v.startsWith('s'))
    ];

    // Extract final solution details
    const finalTable = tables[tables.length - 1];
    const finalSolution = finalTable.table[finalTable.table.length - 1];
    const objectiveFunctionValue = finalSolution[finalSolution.length - 1];
    
    // Extract x values from the final state
    const xValues = initialNonBaseVariables
        .filter(v => v.startsWith('x'))
        .map((variable, index) => ({
            variable, 
            value: finalTable.baseVariables.includes(variable) 
                ? finalTable.table[finalTable.baseVariables.indexOf(variable)][finalTable.table[0].length - 1]
                : 0
        }));

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center mb-6">Simplex Solution</h1>
            
            {/* Linear Program Summary Card */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Linear Program Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Objective Function</h3>
                            <p>{searchParams.function === 'maximize' ? 'Maximize' : 'Minimize'}: 
                                {initialNonBaseVariables
                                    .filter(v => v.startsWith('x'))
                                    .map((v, i) => `${searchParams[`x${i+1}`] || 0}${v}`).join(' + ')}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Constraints</h3>
                            {Array.from({ length: Number(searchParams.constraints) }, (_, i) => (
                                <p key={i}>
                                    {initialNonBaseVariables
                                        .filter(v => v.startsWith('x'))
                                        .map((v, j) => `${searchParams[`C${i+1}_x${j+1}`] || 0}${v}`).join(' + ')} 
                                    ≤ {searchParams[`C${i+1}_b`] || 0}
                                </p>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Final Solution Card */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Final Solution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Decision Variables</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Variable</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {xValues.map(({variable, value}) => (
                                        <TableRow key={variable}>
                                            <TableCell>{variable}</TableCell>
                                            <TableCell>{value.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Objective Function Value</h3>
                            <p className="text-2xl font-bold">
                                {objectiveFunctionValue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Existing Iterations */}
            {tables.map((state, iterationIndex) => {
                // Find pivot cell for this iteration (except last table)
                let pivotRowIndex: number | undefined = undefined;
                let pivotColIndex: number | undefined = undefined;

                if (iterationIndex < tables.length - 1) {
                    // These should match the pivot column and row indices from useSimplex
                    const lastRow = state.table[state.table.length - 1];
                    pivotColIndex = lastRow.slice(0, -1).reduce((maxIndex, currentValue, currentIndex, array) =>
                        currentValue > array[maxIndex] ? currentIndex : maxIndex, 0);

                    // Find pivot row using the minimum ratio method
                    let minRatio = Number.MAX_VALUE;
                    for (let i = 0; i < state.table.length - 1; i++) {
                        if (state.table[i][pivotColIndex] > 0) {
                            const ratio = state.table[i][state.table[i].length - 1] / state.table[i][pivotColIndex];
                            if (ratio >= 0 && ratio < minRatio) {
                                minRatio = ratio;
                                pivotRowIndex = i;
                            }
                        }
                    }
                }

                return (
                    <Card key={iterationIndex} className="w-full">
                        <CardHeader>
                            <CardTitle>Iteration {iterationIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px] text-center">Variable</TableHead>
                                        {initialNonBaseVariables.map((variable) => (
                                            <TableHead key={variable} className="text-center">
                                                {variable}
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-center">RHS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {state.table.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            <TableCell className="font-medium text-center">
                                                {rowIndex < state.baseVariables.length 
                                                    ? `${state.baseVariables[rowIndex]}` 
                                                    : `OBJ F`}
                                            </TableCell>
                                            {row.slice(0, -1).map((cell, cellIndex) => (
                                                <TableCell 
                                                    key={cellIndex} 
                                                    className={`text-center ${
                                                        pivotRowIndex === rowIndex && 
                                                        pivotColIndex === cellIndex
                                                            ? 'bg-primary text-white' 
                                                            : ''
                                                    }`}
                                                >
                                                    {cell.toFixed(2)}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center">
                                                {row[row.length - 1].toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}