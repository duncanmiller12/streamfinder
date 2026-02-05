"use client";

import { useState, useEffect } from "react";
import { STREAMING_SERVICES } from "@/lib/streaming-services";
import ServiceCard from "@/components/ServiceCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Currently persisted service IDs (used to initialise the modal). */
  selectedServices: number[];
  /** Called with the new array of IDs; the parent persists to localStorage. */
  onSave: (ids: number[]) => void;
}

/**
 * Modal for editing streaming-service preferences.
 *
 * Behaviour:
 *   • On mobile  – slides up from the bottom (sheet style), with a drag handle.
 *   • On desktop – centred card with a semi-transparent backdrop.
 *   • The user must keep at least one service selected to save.
 *   • Changes are *not* persisted until "Save Changes" is tapped.
 */
export default function SettingsModal({
  isOpen,
  onClose,
  selectedServices,
  onSave,
}: Props) {
  // Local draft state — synced from props each time the modal opens
  const [selected, setSelected] = useState<Set<number>>(new Set(selectedServices));

  useEffect(() => {
    if (isOpen) setSelected(new Set(selectedServices));
  }, [isOpen, selectedServices]);

  // Lock body scroll while modal is open (prevents background scrolling on mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const allSelected = selected.size === STREAMING_SERVICES.length;

  const toggleService = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(
      allSelected ? new Set() : new Set(STREAMING_SERVICES.map((s) => s.id))
    );
  };

  const handleSave = () => {
    if (selected.size > 0) {
      onSave(Array.from(selected));
      onClose();
    }
  };

  return (
    <>
      {/* Semi-transparent backdrop — tapping it closes the modal */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal sheet */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-gray-900 w-full sm:w-auto sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-700 rounded-full" />
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-white text-lg font-bold">Your Streaming Services</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Select-all toggle */}
          <div className="px-4 pb-1">
            <button
              onClick={toggleAll}
              className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* Service grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-2">
            {STREAMING_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selected.has(service.id)}
                onToggle={() => toggleService(service.id)}
              />
            ))}
          </div>

          {/* Save button */}
          <div className="px-4 py-4">
            <button
              onClick={handleSave}
              disabled={selected.size === 0}
              className={[
                "w-full py-3 rounded-xl font-semibold transition-all",
                selected.size > 0
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 active:scale-95"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed",
              ].join(" ")}
            >
              {selected.size > 0 ? "Save Changes" : "Select at least one service"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
