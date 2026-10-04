"use client";

import { useEffect, useMemo, useState } from "react";

import StudentModal from "@/components/StudentModal";


type Student = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
};


export default function Home() {

  // =========================
  // States
  // =========================

  const [students, setStudents] =
    useState<Student[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);


  // =========================
  // Fetch Students
  // =========================

  const fetchStudents = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/students"
      );


      if (!response.ok) {
        throw new Error(
          "Failed to fetch students"
        );
      }


      const data = await response.json();


      setStudents(data);

    } catch (error) {

      console.error(error);

      setError(
        "Could not connect to backend server."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // Initial Load
  // =========================

  useEffect(() => {

    fetchStudents();

  }, []);


  // =========================
  // Search
  // =========================

  const filteredStudents = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();


    if (!searchText) {
      return students;
    }


    return students.filter((student) => {

      return (
        student.name
          .toLowerCase()
          .includes(searchText) ||

        student.email
          .toLowerCase()
          .includes(searchText) ||

        student.phone
          .toLowerCase()
          .includes(searchText) ||

        student.department
          .toLowerCase()
          .includes(searchText)
      );

    });

  }, [students, search]);


  // =========================
  // Open Add Modal
  // =========================

  const openAddModal = () => {

    setEditingStudent(null);

    setIsModalOpen(true);

  };


  // =========================
  // Open Edit Modal
  // =========================

  const openEditModal = (
    student: Student
  ) => {

    setEditingStudent(student);

    setIsModalOpen(true);

  };


  // =========================
  // Delete Student
  // =========================

  const deleteStudent = async (
    id: string
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:5000/students/${id}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete student"
        );

      }


      // Refresh list

      fetchStudents();


    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete student"
      );

    }

  };


  // =========================
  // Department Count
  // =========================

  const departmentCount =
    new Set(
      students.map(
        (student) =>
          student.department
      )
    ).size;


  return (

    <main className="min-h-screen bg-slate-950 text-white">


      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}

          <div>

            <h1 className="text-2xl font-bold tracking-tight">

              Student
              <span className="text-blue-400">
                Hub
              </span>

            </h1>

            <p className="text-sm text-slate-500">
              Student Management System
            </p>

          </div>


          {/* Add Button */}

          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
          >
            + Add Student
          </button>

        </div>

      </header>


      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-10">


        {/* Hero */}

        <div className="mb-10">

          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-400">
            Dashboard
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            Student Management
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage students, departments,
            contact information and records
            from one simple dashboard.
          </p>

        </div>


        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}

        <div className="mb-8 grid gap-5 md:grid-cols-3">


          {/* Total */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Total Students
              </p>

              <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-blue-400">
                👨‍🎓
              </div>

            </div>

            <h3 className="mt-4 text-4xl font-bold">
              {students.length}
            </h3>

          </div>


          {/* Departments */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Departments
              </p>

              <div className="rounded-xl bg-purple-500/10 px-3 py-2 text-purple-400">
                🏫
              </div>

            </div>

            <h3 className="mt-4 text-4xl font-bold">
              {departmentCount}
            </h3>

          </div>


          {/* Search Results */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Showing
              </p>

              <div className="rounded-xl bg-green-500/10 px-3 py-2 text-green-400">
                ✓
              </div>

            </div>

            <h3 className="mt-4 text-4xl font-bold text-green-400">
              {filteredStudents.length}
            </h3>

          </div>

        </div>


        {/* ========================= */}
        {/* SEARCH */}
        {/* ========================= */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email, phone or department..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 transition focus:border-blue-500 focus:bg-white/10"
            />

          </div>


          <button
            onClick={openAddModal}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 font-medium text-blue-400 transition hover:bg-blue-500/20"
          >
            + New Student
          </button>

        </div>


        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>

        )}


        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">


          {/* Loading */}

          {loading ? (

            <div className="p-16 text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

              <p className="text-slate-400">
                Loading students...
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">


                {/* Table Header */}

                <thead className="border-b border-white/10 bg-white/[0.03]">

                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                {/* Table Body */}

                <tbody>

                  {filteredStudents.map(
                    (student) => (

                    <tr
                      key={student._id}
                      className="border-b border-white/5 transition hover:bg-white/[0.04]"
                    >


                      {/* Student */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">

                            {student.name
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <p className="font-semibold">
                              {student.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              Student
                            </p>

                          </div>

                        </div>

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

                        <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                          {student.department}
                        </span>

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditModal(student)
                            }
                            className="rounded-lg bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
                          >
                            Edit
                          </button>


                          <button
                            onClick={() =>
                              deleteStudent(
                                student._id
                              )
                            }
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}


                  {/* Empty */}

                  {filteredStudents.length === 0 && (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center"
                      >

                        <div className="text-4xl">
                          🔍
                        </div>

                        <p className="mt-4 font-medium text-slate-300">
                          No students found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try another search or add a new student.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </section>


      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}

      <StudentModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onStudentSaved={fetchStudents}
        editingStudent={editingStudent}
      />

    </main>

  );
}