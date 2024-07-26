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
import Image from "next/image";

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
  const [inputErrorMessage, setInputErrorMessage] = useState("");
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
    const isValid = /^[0-9xX+\-*/^() ]+$/.test(expression);

    if (!isValid) {
      setInputErrorMessage("La función debe ser una variable x");
      return;
    } else {
      setInputErrorMessage("");
    }
    setExpression(expression.toLowerCase());
  }

  return (
    <main className="container mx-auto flex max-w-[60rem] flex-grow flex-col gap-y-4">
      <div className="mt-12 text-center">
        <h1 className="inline-block text-4xl text-slate-800">
          Calculadora de Derivadas
          <Image
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            className="align-center ml-1 inline-block"
          />
        </h1>
      </div>
      <section className="mt-16 flex flex-col sm:self-center">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl text-slate-600">
            <label htmlFor="expression">Función</label>
          </h2>
          <div className="mt-4 flex">
            <input
              type="text"
              name="expression"
              id="expression"
              className="rounded ps-2"
            />
            <button className="ms-4 rounded bg-slate-600 px-2 py-1 text-slate-100 hover:bg-slate-500 active:bg-slate-700">
              Derivar
            </button>
          </div>
          <div className="mt-2">
            <span className="italic">Formato: 2x^2</span>
          </div>
          <div className="mt-2 min-h-8">
            {inputErrorMessage && (
              <span className="text-xl font-semibold text-red-500">
                {inputErrorMessage}
              </span>
            )}
          </div>
        </form>
      </section>
      <section className="flex flex-col gap-y-4">
        <h2 className="text-2xl text-slate-600">Resultados</h2>
        <div>
          <h3 className="mb-1 font-medium">Función</h3>
          <Latex>{`\\(${expression}\\)`}</Latex>
          <h3 className="mb-1 mt-4 font-medium">Derivada</h3>
          <Latex>{`\\(${derivativeLatex}\\)`}</Latex>
        </div>
      </section>
      <section>
        <h2 className="mt-4 text-2xl text-slate-600">Representación gráfica</h2>
        {chartData && <Line className="mt-2" data={chartData} />}
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
