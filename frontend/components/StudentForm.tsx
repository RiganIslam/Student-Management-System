"use client";

import { useEffect, useState } from "react";
import StudentForm from "@/components/StudentForm";

type Student = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
};

export default function Home() {
  // Students state
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/students"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  // Load students when page opens
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold">
              Student
              <span className="text-blue-400">
                Hub
              </span>
            </h1>

            <p className="text-sm text-slate-400">
              Student Management System
            </p>
          </div>

          {/* Header Button */}
          <button
            onClick={() => {
              document
                .getElementById("student-form")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="rounded-xl bg-blue-500 px-5 py-3 font-medium transition hover:bg-blue-600"
          >
            + Add Student
          </button>

        </div>
      </header>


      {/* ================= MAIN ================= */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Title */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Students
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your students from one place.
          </p>

        </div>


        {/* ================= STATS ================= */}

        <div className="mb-8 grid gap-5 md:grid-cols-3">

          {/* Total Students */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">

            <p className="text-sm text-slate-400">
              Total Students
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {students.length}
            </h3>

          </div>


          {/* Departments */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">

            <p className="text-sm text-slate-400">
              Departments
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {
                new Set(
                  students.map(
                    (student) =>
                      student.department
                  )
                ).size
              }
            </h3>

          </div>


          {/* Loaded */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">

            <p className="text-sm text-slate-400">
              Students Loaded
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-400">
              {students.length}
            </h3>

          </div>

        </div>


        {/* ================= ADD STUDENT FORM ================= */}

        <div id="student-form">
          <StudentForm
            onStudentAdded={fetchStudents}
          />
        </div>


        {/* ================= SEARCH ================= */}

        <div className="mb-6">

          <input
            type="text"
            placeholder="Search students..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
          />

        </div>


        {/* ================= STUDENT TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              {/* Table Header */}

              <thead className="border-b border-white/10">

                <tr>

                  <th className="px-6 py-4 text-sm text-slate-400">
                    Name
                  </th>

                  <th className="px-6 py-4 text-sm text-slate-400">
                    Email
                  </th>

                  <th className="px-6 py-4 text-sm text-slate-400">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-sm text-slate-400">
                    Department
                  </th>

                  <th className="px-6 py-4 text-sm text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>


              {/* Table Body */}

              <tbody>

                {students.map((student) => (

                  <tr
                    key={student._id}
                    className="border-b border-white/10 transition hover:bg-white/5"
                  >

                    {/* Name */}

                    <td className="px-6 py-5 font-medium">
                      {student.name}
                    </td>


                    {/* Email */}

                    <td className="px-6 py-5 text-slate-400">
                      {student.email}
                    </td>


                    {/* Phone */}

                    <td className="px-6 py-5 text-slate-400">
                      {student.phone}
                    </td>


                    {/* Department */}

                    <td className="px-6 py-5">

                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                        {student.department}
                      </span>

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex gap-2">

                        <button
                          className="rounded-lg bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
                        >
                          Edit
                        </button>

                        <button
                          className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}


                {/* Empty State */}

                {students.length === 0 && (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No students found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </main>
  );
}