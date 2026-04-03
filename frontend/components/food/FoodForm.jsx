"use client";

import FoodImageUpload from "./FoodImageUpload";

export default function FoodForm({
  values,
  errors,
  onFieldChange,
  onImageChange,
  onUseCurrentLocation,
  loadingLocation,
}) {
  return (
    <div className="food-form">
      <FoodImageUpload
        file={values.imageFile}
        onChange={onImageChange}
        error={errors.imageFile}
      />

      <div className="grid">
        <label>
          <span>Item Name</span>
          <input
            type="text"
            value={values.foodName}
            onChange={event => onFieldChange("foodName", event.target.value)}
            placeholder="Ex: Britannia Cake Rusk"
          />
          {errors.foodName ? <small>{errors.foodName}</small> : null}
        </label>

        <label>
          <span>Quantity (Units)</span>
          <input
            type="number"
            min="1"
            value={values.quantity}
            onChange={event => onFieldChange("quantity", event.target.value)}
            placeholder="Ex: 120"
          />
          {errors.quantity ? <small>{errors.quantity}</small> : null}
        </label>

        <label>
          <span>Category (Optional)</span>
          <input
            type="text"
            value={values.category}
            onChange={event => onFieldChange("category", event.target.value)}
            placeholder="Ex: Biscuits / Beverage / Snacks"
          />
        </label>

        <label>
          <span>Expiry Date</span>
          <input
            type="date"
            value={values.expiryDate}
            onChange={event => onFieldChange("expiryDate", event.target.value)}
          />
          {errors.expiryDate ? <small>{errors.expiryDate}</small> : null}
        </label>

        <label>
          <span>Original Price (INR)</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={values.originalPrice}
            onChange={event => onFieldChange("originalPrice", event.target.value)}
            placeholder="Ex: 120"
          />
          {errors.originalPrice ? <small>{errors.originalPrice}</small> : null}
        </label>

        <label className="location">
          <span>Pickup Location</span>
          <div className="location-row">
            <input
              type="text"
              value={values.location}
              onChange={event => onFieldChange("location", event.target.value)}
              placeholder="Address or area"
            />
            <button
              type="button"
              className="ghost"
              onClick={onUseCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? "Locating..." : "Use Current"}
            </button>
          </div>
          {errors.location ? <small>{errors.location}</small> : null}
        </label>
      </div>

      <label>
        <span>Optional Notes</span>
        <textarea
          rows={3}
          value={values.notes}
          onChange={event => onFieldChange("notes", event.target.value)}
          placeholder="Ex: Stored in fridge, packed in sealed trays."
        />
      </label>

      <style jsx>{`
        .food-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        span {
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #334155;
        }
        input,
        select,
        textarea {
          border: 1px solid #cfddd2;
          border-radius: 12px;
          padding: 12px 12px;
          font-size: 15px;
          background: #fcfffd;
          outline: none;
          transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
        }
        input:focus,
        select:focus,
        textarea:focus {
          border-color: #0e9f6e;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(14, 159, 110, 0.16);
        }
        .location {
          grid-column: span 2;
        }
        .location-row {
          display: flex;
          gap: 8px;
        }
        .location-row input {
          flex: 1;
        }
        .ghost {
          border: 1px solid #bcd7c8;
          border-radius: 12px;
          padding: 0 12px;
          background: linear-gradient(180deg, #ffffff, #f4fbf7);
          cursor: pointer;
          font-weight: 600;
          color: #0b7c57;
        }
        .ghost:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        small {
          color: #b91c1c;
          font-weight: 500;
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .location {
            grid-column: span 1;
          }
          .location-row {
            flex-direction: column;
          }
          .ghost {
            height: 38px;
          }
        }
      `}</style>
    </div>
  );
}
