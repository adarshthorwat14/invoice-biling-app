import React, { useState } from "react";
import InvoiceInputPanel from "./InvoiceInputPanel";
import InvoiceItemsPanel from "./InvoiceItemsPanel";
import styles from "./CreateInvoiceForm.module.css";
import api from "../../api/axiosConfig";

const CreateInvoiceForm = () => {
  // Invoice Info (Left Panel)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState("Unpaid");
  const [taxRate, setTaxRate] = useState("");
  const [discount, setDiscount] = useState("");
  const [generatedBy, setGeneratedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [clientId, setClientId] = useState("");

  // Invoice Items (Right Panel)
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleCreateInvoice = () => {
    const payload = {
      invoiceDate,
      dueDate,
      paymentMethod,
      status,
      taxRate,
      discount,
      generatedBy,
      notes,
      totalAmount,
      clientId,
      invoiceItems: invoiceItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
        taxRate: item.taxRate || taxRate,
      })),
    };

    api
      .post("/api/invoices", payload)
      .then(() => alert("✅ Invoice created successfully!"))
      .catch(err => {
        console.error("❌ Error creating invoice:", err);
        alert("Failed to create invoice.");
      });
  };

  return (
    <div className={styles.formWrapper}>
      <InvoiceInputPanel
        clientId={clientId}
        setClientId={setClientId}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        status={status}
        setStatus={setStatus}
        taxRate={taxRate}
        setTaxRate={setTaxRate}
        discount={discount}
        setDiscount={setDiscount}
        generatedBy={generatedBy}
        setGeneratedBy={setGeneratedBy}
        notes={notes}
        setNotes={setNotes}
      />

      <InvoiceItemsPanel
        invoiceItems={invoiceItems}
        setInvoiceItems={setInvoiceItems}
        totalAmount={totalAmount}
        setTotalAmount={setTotalAmount}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};

export default CreateInvoiceForm;
