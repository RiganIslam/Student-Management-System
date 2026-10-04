"use client";

import { useEffect, useState } from "react";

type Student = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
};

type StudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStudentSaved: () => void;
  editingStudent: Student | null;
};

export default function StudentModal({
  isOpen,
  onClose,
  onStudentSaved,
  editingStudent,
}: StudentModalProps) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);


  // =========================
  // Load editing student
  // =========================

  useEffect(() => {

    if (editingStudent) {

      setName(editingStudent.name);
      setEmail(editingStudent.email);
      setPhone(editingStudent.phone);
      setDepartment(editingStudent.department);

    } else {

      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");

    }

  }, [editingStudent, isOpen]);


  if (!isOpen) {
    return null;
  }


  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    if (
      !name ||
      !email ||
      !phone ||
      !department
    ) {

      alert("Please fill all fields");

      return;
    }


    setLoading(true);


    try {

      let url =
        "http://localhost:5000/students";

      let method = "POST";


      // Editing

      if (editingStudent?._id) {

        url =
          `http://localhost:5000/students/${editingStudent._id}`;

        method = "PUT";
      }


      const response = await fetch(url, {

        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          department,
        }),

      });


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }


      // Clear form

      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");


      // Refresh students

      onStudentSaved();


      // Close modal

      onClose();


    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">


        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-white">

              {editingStudent
                ? "Edit Student"
                : "Add New Student"}

            </h2>

            <p className="mt-1 text-sm text-slate-400">

              {editingStudent
                ? "Update student information"
                : "Enter student information"}

            </p>

          </div>


          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>

        </div>


        {/* Form */}

        <form onSubmit={handleSubmit}>

          <div className="grid gap-5 md:grid-cols-2">


            {/* Name */}

            <div>

              <label className="mb-2 block text-sm text-slate-300">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter student name"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="student@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>


            {/* Phone */}

            <div>

              <label className="mb-2 block text-sm text-slate-300">
                Phone
              </label>

              <input
  type="tel"
  inputMode="numeric"
  value={phone}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  }}
  placeholder="01XXXXXXXXX"
  maxLength={11}
  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
/>

            </div>


            {/* Department */}

            <div>

              <label className="mb-2 block text-sm text-slate-300">
                Department
              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >

                <option value="">
                  Select department
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>

                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>

                <option value="Business Administration">
                  Business Administration
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>

                <option value="English">
                  English
                </option>

              </select>

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-7 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3 text-slate-300 transition hover:bg-white/5"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Saving..."
                : editingStudent
                ? "Update Student"
                : "Add Student"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}