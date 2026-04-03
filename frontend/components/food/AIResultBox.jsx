"use client";

function formatExpiry(result) {
  if (!result) {
    return "--";
  }
  if (result.estimatedExpiryHours !== null && result.estimatedExpiryHours !== undefined) {
    return `${result.estimatedExpiryHours} hours`;
  }
  if (result.estimatedExpiryAt) {
    return new Date(result.estimatedExpiryAt).toLocaleString();
  }
  return "--";
}

export default function AIResultBox({ result }) {
  if (!result) {
    return (
      <div className="ai-box neutral">
        <h3>AI Result</h3>
        <p>Run "Suggest Price" to get expiry-based discount and expected selling rate.</p>
        <style jsx>{`
          .ai-box {
            border-radius: 14px;
            padding: 16px;
          }
          .neutral {
            border: 1px dashed #cbd9cf;
            background: #f9fcfa;
          }
          h3 {
            margin: 0 0 8px;
            font-size: 24px;
          }
          p {
            margin: 0;
            color: #4b5563;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`ai-box ${result.isSafe ? "safe" : "unsafe"}`}>
      <h3>AI Result</h3>
      <div className="meta">
        <span className="pill">{result.source || "backend-ai"}</span>
      </div>
      <div className="rows">
        <p>
          <strong>Detected Item:</strong> {result.detectedFoodName || "--"}
        </p>
        <p>
          <strong>Expected Sell Price:</strong>{" "}
          {typeof result.expectedSellPrice === "number" ? `Rs. ${result.expectedSellPrice}` : "--"}
        </p>
        <p>
          <strong>Suggested Discount:</strong>{" "}
          {typeof result.suggestedDiscountPercent === "number"
            ? `${result.suggestedDiscountPercent}%`
            : "--"}
        </p>
        <p>
          <strong>Expiry:</strong> {formatExpiry(result)}
        </p>
        <p>
          <strong>Confidence:</strong>{" "}
          {typeof result.confidence === "number"
            ? `${Math.round(result.confidence * 100)}%`
            : "--"}
        </p>
        <p>
          <strong>Reason:</strong> {result.reason}
        </p>
      </div>
      <style jsx>{`
        .ai-box {
          border-radius: 14px;
          padding: 16px;
          border: 1px solid #ddd;
        }
        .safe {
          border-color: #8bd4b5;
          background: linear-gradient(180deg, #ecfff6, #f5fff9);
        }
        .unsafe {
          border-color: #f2a3a3;
          background: linear-gradient(180deg, #fff3f3, #fff7f7);
        }
        h3 {
          margin: 0;
          font-size: 24px;
        }
        .meta {
          margin: 10px 0 10px;
        }
        .pill {
          display: inline-flex;
          border-radius: 999px;
          border: 1px solid #d1e7db;
          background: #ffffff;
          color: #0b7c57;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          padding: 4px 9px;
        }
        .rows {
          display: grid;
          gap: 7px;
        }
        p {
          margin: 0;
          color: #1f2937;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
