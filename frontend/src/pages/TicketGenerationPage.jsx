import { useState, useEffect } from "react";
import { Ticket, CheckCircle2 } from "lucide-react";
import { getAllCategories, createTicket } from "../services/ticketService";
import { generateTicketNumber } from "../utils/ticketNumberGenerator";

export default function TicketGenerationPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const result = await getAllCategories();
      setCategories(result);
    } catch (error) {
      setErrorMessage("Could not load categories.");
    }
  }

  function handleSelectCategory(categoryId) {
    setSelectedCategoryId(categoryId);
  }

  async function handleCreateTicket() {
    if (selectedCategoryId === null) {
      setErrorMessage("Please select a category first.");
      return;
    }

    let selectedCategory = null;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === selectedCategoryId) {
        selectedCategory = categories[i];
      }
    }

    if (selectedCategory === null) {
      setErrorMessage("Selected category not found.");
      return;
    }

    const newTicketNumber = generateTicketNumber(selectedCategory.prefix_code);

    try {
      const createdTicket = await createTicket(selectedCategoryId, newTicketNumber);
      setGeneratedTicket(createdTicket);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Could not create ticket. Please try again.");
    }
  }

  function handleStartOver() {
    setGeneratedTicket(null);
    setSelectedCategoryId(null);
  }

  if (generatedTicket !== null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-500 mb-2">Your ticket number is</p>
          <p className="text-4xl font-semibold text-slate-800 mb-6">
            {generatedTicket.ticket_number}
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Please wait for your number to be called.
          </p>
          <button
            onClick={handleStartOver}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Generate another ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <Ticket className="w-5 h-5 text-slate-400" />
          <h1 className="text-xl font-semibold text-slate-800">Get a ticket</h1>
        </div>

        {errorMessage !== "" && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMessage}
          </div>
        )}

        <p className="text-sm text-slate-500 mb-3">Select a service</p>

        <div className="space-y-2 mb-6">
          {categories.map((category) => {
            let buttonClass = "w-full text-left border rounded-lg px-4 py-3 text-sm font-medium transition-colors ";

            if (selectedCategoryId === category.id) {
              buttonClass = buttonClass + "border-blue-500 bg-blue-50 text-blue-700";
            } else {
              buttonClass = buttonClass + "border-slate-200 text-slate-700 hover:bg-slate-50";
            }

            return (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className={buttonClass}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCreateTicket}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium"
        >
          Create ticket
        </button>
      </div>
    </div>
  );
}