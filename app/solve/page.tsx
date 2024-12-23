import { simplexUrlParams, useSimplex } from "@/hooks/useSimplex";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Solve({searchParams}: {searchParams: simplexUrlParams}) {
    const {tables} = useSimplex(searchParams);
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Simplex Iterations</h1>
            {tables.map((table, iterationIndex) => (
                <div key={iterationIndex} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        Iteration {iterationIndex + 1}
                    </h2>
                    <Table>
                        <TableCaption>Simplex Tableau</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {table[0].map((_, colIndex) => (
                                    <TableHead key={colIndex}>
                                        {colIndex === table[0].length - 1 
                                            ? 'RHS' 
                                            : `x${colIndex + 1}`}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {table.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            {cell.toFixed(2)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    );
}