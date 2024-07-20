"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js/auto";
import "katex/dist/katex.min.css";
import * as math from "mathjs";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Latex from "react-latex-next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function HomePage() {
  const [expression, setExpression] = useState("x");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const derivativeInfo = (expression: string) => {
    try {
      const func = math.parse(expression);
      const derivative = math.derivative(func, "x");

      // Generate LaTeX for the derivative
      const derivativeLatex = derivative
        .toTex({ parenthesis: "auto" })
        .replace(/\*1/g, "") // Remove unnecessary *1
        .replace(/1\*/g, ""); // Remove unnecessary 1*

      return {
        derivative: derivative.toString(),
        derivativeLatex: derivativeLatex,
      };
    } catch (error) {
      // ... (error handling: return null or default values)
      return {
        derivative: null,
        derivativeLatex: null,
      };
    }
  };

  const { derivative, derivativeLatex } = derivativeInfo(expression);

  useEffect(() => {
    if (!expression) {
      return;
    }
    try {
      const func = math.parse(expression);
      const derivative = math.derivative(func, "x");

      const newData: ChartData = {
        labels: [],
        datasets: [
          {
            label: expression, // Label with the original function
            data: [],
            fill: false,
            borderColor: "blue",
            tension: 0.1,
          },
          {
            label: derivative.toString(),
            data: [],
            fill: false,
            borderColor: "rgb(75, 192, 192)", // Derivative color
            tension: 0.1,
          },
        ],
      };

      for (let x = -10; x <= 10; x += 0.5) {
        newData.labels.push(x);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        newData.datasets[0]?.data.push(func.evaluate({ x })); // Original function values
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        newData.datasets[1]?.data.push(derivative.evaluate({ x }));
      }
      setChartData(newData);
    } catch (error) {
      console.error("Error evaluating expression:", error);
      setChartData(null);
    }
  }, [expression]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const expression = formData.get("expression") as string;
    setExpression(expression.toLowerCase());
  }

  return (
    <main className="container mx-auto flex flex-grow flex-col gap-y-12">
      <h1 className="mt-12 text-center text-4xl text-slate-900">
        Calculadora de Derivadas
      </h1>
      <section className="flex flex-col">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl text-slate-800">
            <label htmlFor="expression">Función</label>
          </h2>
          <div className="mt-4 flex">
            <input
              type="text"
              name="expression"
              id="expression"
              className="rounded ps-2"
            />
            <button className="ms-4 rounded bg-slate-600 px-2 py-1 text-slate-100">
              Derivar
            </button>
          </div>
          <div className="mt-2">
            <span className="italic">Formato: 2x^2</span>
          </div>
        </form>
      </section>
      <section className="flex flex-col gap-y-4">
        <h2 className="text-2xl text-slate-800">Resultados</h2>
        <div>
          <h3>Función</h3>
          {expression && <Latex>{`\\(${expression}\\)`}</Latex>}
          <h3 className="mt-4">Derivada</h3>
          {derivativeLatex === "0" ? null : (
            <Latex>{`\\(${derivativeLatex}\\)`}</Latex>
          )}
        </div>
        <div>
          <h2 className="mt-4 text-2xl text-slate-800">
            Representación gráfica
          </h2>
          <div>{chartData && <Line data={chartData} />}</div>
        </div>
      </section>
    </main>
  );
}

type ChartData = {
  labels: number[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
};
