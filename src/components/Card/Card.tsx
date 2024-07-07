"use client";
import EngineSwitcher from "../Switchers/EngineSwitcher";

export default function Card({ children, title }: any) {
  return (
    <div className="col-span-12 flex flex-col items-center justify-center rounded-xl border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:col-span-4">
      <h3 className="mb-5 font-bold">{title}</h3>
      {children}
    </div>
  );
}
