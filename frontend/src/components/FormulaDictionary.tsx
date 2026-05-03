import { useState } from "react";
import styles from "./FormulaDictionary.module.css";

type FormulaInputs = Record<string, number | undefined>;
type Formula = {
  name: string;
  description: string;
  variables: {
    key: string;
    label: string;
  }[];
  calculate: (inputs: FormulaInputs) => string;
};

function hasValues(...values: Array<number | undefined>) {
  return values.every((value) => value !== undefined && Number.isFinite(value));
}

function format(value: number, unit: string) {
  return `${Number(value.toFixed(4))} ${unit}`;
}

const formulas: Formula[] = [
  {
    name: "Vektorel Toplama - Dik Vektorler",
    description: "Birbirine dik iki vektor icin bileske: R = sqrt(A^2 + B^2)",
    variables: [
      { key: "a", label: "Vektor A" },
      { key: "b", label: "Vektor B" },
    ],
    calculate: ({ a, b }) => {
      if (!hasValues(a, b)) return "";
      return format(Math.sqrt(a! * a! + b! * b!), "birim");
    },
  },
  {
    name: "Vektorel Toplama - Acili Vektorler",
    description: "Iki vektor arasinda aci varsa: R = sqrt(A^2 + B^2 + 2ABcos(theta))",
    variables: [
      { key: "a", label: "Vektor A" },
      { key: "b", label: "Vektor B" },
      { key: "theta", label: "Aci theta (derece)" },
    ],
    calculate: ({ a, b, theta }) => {
      if (!hasValues(a, b, theta)) return "";
      const radians = (theta! * Math.PI) / 180;
      return format(Math.sqrt(a! * a! + b! * b! + 2 * a! * b! * Math.cos(radians)), "birim");
    },
  },
  {
    name: "Coulomb Yasasi",
    description: "Iki yuk arasindaki elektriksel kuvvet: F = k * |q1 * q2| / r^2",
    variables: [
      { key: "q1", label: "Yuk 1 (C)" },
      { key: "q2", label: "Yuk 2 (C)" },
      { key: "r", label: "Mesafe (m)" },
    ],
    calculate: ({ q1, q2, r }) => {
      if (!hasValues(q1, q2, r) || r === 0) return "";
      const k = 8.9875517923e9;
      return format((k * Math.abs(q1! * q2!)) / (r! * r!), "N");
    },
  },
  {
    name: "Elektrik Alani",
    description: "Bir yuke etki eden kuvvetten elektrik alani: E = F / q",
    variables: [
      { key: "f", label: "Kuvvet F (N)" },
      { key: "q", label: "Yuk q (C)" },
    ],
    calculate: ({ f, q }) => {
      if (!hasValues(f, q) || q === 0) return "";
      return format(f! / q!, "N/C");
    },
  },
  {
    name: "Noktasal Yuk Elektrik Alani",
    description: "Noktasal yukun elektrik alani: E = k * |q| / r^2",
    variables: [
      { key: "q", label: "Yuk q (C)" },
      { key: "r", label: "Mesafe (m)" },
    ],
    calculate: ({ q, r }) => {
      if (!hasValues(q, r) || r === 0) return "";
      const k = 8.9875517923e9;
      return format((k * Math.abs(q!)) / (r! * r!), "N/C");
    },
  },
  {
    name: "Elektrik Potansiyeli",
    description: "Noktasal yuk icin potansiyel: V = k * q / r",
    variables: [
      { key: "q", label: "Yuk q (C)" },
      { key: "r", label: "Mesafe (m)" },
    ],
    calculate: ({ q, r }) => {
      if (!hasValues(q, r) || r === 0) return "";
      const k = 8.9875517923e9;
      return format((k * q!) / r!, "V");
    },
  },
  {
    name: "Ohm Yasasi",
    description: "Gerilim, akim ve direnc iliskisi: V = I * R",
    variables: [
      { key: "i", label: "Akim I (A)" },
      { key: "r", label: "Direnc R (ohm)" },
    ],
    calculate: ({ i, r }) => {
      if (!hasValues(i, r)) return "";
      return format(i! * r!, "V");
    },
  },
  {
    name: "Elektriksel Guc",
    description: "Elektriksel guc: P = V * I",
    variables: [
      { key: "v", label: "Gerilim V (V)" },
      { key: "i", label: "Akim I (A)" },
    ],
    calculate: ({ v, i }) => {
      if (!hasValues(v, i)) return "";
      return format(v! * i!, "W");
    },
  },
  {
    name: "Seri Direnc",
    description: "Seri bagli direnclerde esdeger direnc: R_eq = R1 + R2 + R3",
    variables: [
      { key: "r1", label: "R1 (ohm)" },
      { key: "r2", label: "R2 (ohm)" },
      { key: "r3", label: "R3 (ohm)" },
    ],
    calculate: ({ r1, r2, r3 }) => {
      if (!hasValues(r1, r2, r3)) return "";
      return format(r1! + r2! + r3!, "ohm");
    },
  },
  {
    name: "Paralel Direnc",
    description: "Paralel bagli direnclerde: 1 / R_eq = 1/R1 + 1/R2 + 1/R3",
    variables: [
      { key: "r1", label: "R1 (ohm)" },
      { key: "r2", label: "R2 (ohm)" },
      { key: "r3", label: "R3 (ohm)" },
    ],
    calculate: ({ r1, r2, r3 }) => {
      if (!hasValues(r1, r2, r3) || r1 === 0 || r2 === 0 || r3 === 0) return "";
      return format(1 / (1 / r1! + 1 / r2! + 1 / r3!), "ohm");
    },
  },
  {
    name: "Sigac Yuku",
    description: "Sigacta depolanan yuk: Q = C * V",
    variables: [
      { key: "c", label: "Siga C (F)" },
      { key: "v", label: "Gerilim V (V)" },
    ],
    calculate: ({ c, v }) => {
      if (!hasValues(c, v)) return "";
      return format(c! * v!, "C");
    },
  },
  {
    name: "Sigac Enerjisi",
    description: "Sigacta depolanan enerji: E = 1/2 * C * V^2",
    variables: [
      { key: "c", label: "Siga C (F)" },
      { key: "v", label: "Gerilim V (V)" },
    ],
    calculate: ({ c, v }) => {
      if (!hasValues(c, v)) return "";
      return format(0.5 * c! * v! * v!, "J");
    },
  },
];

export default function FormulaDictionary() {
  const [selected, setSelected] = useState(0);
  const [inputs, setInputs] = useState<FormulaInputs>({});

  const formula = formulas[selected];

  const handleInput = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value ? parseFloat(value) : undefined }));
  };

  return (
    <div className={styles.container}>
      <h2>Formul Sozlugu</h2>
      <select
        value={selected}
        onChange={(event) => {
          setSelected(Number(event.target.value));
          setInputs({});
        }}
      >
        {formulas.map((item, index) => (
          <option value={index} key={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <div className={styles.formulaBox}>
        <p>{formula.description}</p>
        <div className={styles.inputs}>
          {formula.variables.map((variable) => (
            <label key={variable.key}>
              {variable.label}
              <input
                type="number"
                value={inputs[variable.key] ?? ""}
                onChange={(event) => handleInput(variable.key, event.target.value)}
              />
            </label>
          ))}
        </div>
        <div className={styles.result}>
          <strong>Sonuc: </strong>
          {formula.calculate(inputs)}
        </div>
      </div>
    </div>
  );
}
