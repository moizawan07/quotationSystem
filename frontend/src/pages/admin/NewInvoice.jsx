import { EyeClosed, Folder, Send, MoveRight } from "lucide-react";
import Logo from "../../assets/images/logo.png";
import { useState } from "react";
import {base_url} from '../../services/config'
import {useAuthContext} from '../../context/AuthContext'
import axios from 'axios'

const NewInvoice = () => {
  const [tabState, settabState] = useState("Customer Details");
  const {getUserDetails} = useAuthContext();
  
  // Customer Details State
  const [customerForm, setCustomerForm] = useState({
    customerName: "Brown Martin",
    companyName: "Digital Thermal",
    deliveryAddress: "901 Bidgiv, between McKinney and Walker, Houston",
    city: "Houston",
    state: "Texas",
    postalCode: "77002",
    email: "thornwardhelby@gmail.com",
    phone: "+1-281-555-5421",
    specialInstruction: "Type Special Note"
  });

  // Product Details State
  const [productForm, setProductForm] = useState({
    productName: "",
    category: "",
    unitMeasure: "",
    quantity: "",
    city: "",
    phone: "",
    unitPrice: "",
    discount: "",
    tax: ""
  });

  // Product List State
  const [products, setProducts] = useState([]);

  // Price Summary State
  const [priceSummary, setPriceSummary] = useState({
    subTotal: "",
    totalDiscount: "",
    totalTax: "",
    grandTotal: ""
  });

  // Handle Customer Form Changes
  const handleCustomerChange = (field, value) => {
    setCustomerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Product Form Changes
  const handleProductChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Price Summary Changes
  const handlePriceSummaryChange = (field, value) => {
    setPriceSummary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add New Product
  const handleAddProduct = () => {
    if (productForm.productName && productForm.quantity && productForm.unitPrice) {
      const newProduct = {
        id: Date.now(),
        ...productForm
      };
      setProducts(prev => [...prev, newProduct]);
      
      // Reset product form
      setProductForm({
        productName: "",
        category: "",
        unitMeasure: "",
        quantity: "",
        city: "",
        phone: "",
        unitPrice: "",
        discount: "",
        tax: ""
      });
    }
  };


const handleSubmit = async () => {
  const user = getUserDetails(); 
  if (!user) return alert("User not found");

  console.log("productForm ==>", productForm);
  

  try {
    const url = `${base_url}/quotation/create`;
    const res = await axios.post(
     url,
      {customerDetails : customerForm, products: [productForm], totalAmount :  priceSummary.grandTotal,  companyId : user.companyId}, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    console.log("Quotation Created:", res.data);
    alert("Quotation Created Successfully!");
  } catch (error) {
    console.error(error);
    alert("Error creating quotation");
  }
};

  

  return (
    <section className="px-4 md:px-7 pt-6 md:pt-8 w-full bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold">New Invoice</h1>

        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <button className="bg-[#F9F9F9] text-sm md:text-base rounded-lg px-3 py-2 flex items-center gap-2">
            <EyeClosed size={16} />
            Hide Preview
          </button>

          <button className="bg-[#1C2730] text-sm md:text-base text-white rounded-lg px-3 py-2 flex items-center gap-2">
            <Folder size={16} />
            Save as Draft
          </button>

          <button className="bg-[#F9F9F9] text-sm md:text-base rounded-lg px-3 py-2 flex items-center gap-2">
            <Send size={16} />
            Send Invoice
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* LEFT FORM SECTION */}
        <div className="bg-[#C2C2C21F] rounded-lg border-2 border-[#C2C2C21F] px-5 pt-4 pb-8 min-h-[500px]">
          <div className="flex flex-col justify-between h-full">

            {/* Tabs */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {["Customer Details", "Add Product", "Price Summary"].map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => settabState(tab)}
                    className={`text-xs font-bold px-2 py-[6px] rounded-2xl border-2
                      ${tabState === tab 
                        ? "bg-[#007AFF] text-white border-[#007AFF]"
                        : "bg-white text-[#007AFF] border-[#007AFF]"
                      }`}
                  >
                    {tab}
                  </button>
                ))}

                <button className="text-xs text-[#007AFF] font-bold px-2 py-[6px]">
                  <MoveRight />
                </button>
              </div>

              {/* Conditional Rendering */}
              {tabState === "Price Summary" ? (
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Sub Total */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Sub Total</label>
                    <input
                      type="text"
                      value={priceSummary.subTotal}
                      onChange={(e) => handlePriceSummaryChange("subTotal", e.target.value)}
                      placeholder="Add Calculator"
                      className="text-xs text-[#00000099] border-2 border-[#C7C7C7] rounded-lg pl-4 py-3"
                    />
                  </div>

                  {/* Total Discount Applied */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Total Discount Applied</label>
                    <input
                      type="text"
                      value={priceSummary.totalDiscount}
                      onChange={(e) => handlePriceSummaryChange("totalDiscount", e.target.value)}
                      placeholder="Add Calculator"
                      className="text-xs text-[#00000099] border-2 border-[#C7C7C7] rounded-lg pl-4 py-3"
                    />
                  </div>

                  {/* Total Tax Applied */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Total Tax Applied</label>
                    <input
                      type="text"
                      value={priceSummary.totalTax}
                      onChange={(e) => handlePriceSummaryChange("totalTax", e.target.value)}
                      placeholder="Add Calculator"
                      className="text-xs text-[#00000099] border-2 border-[#C7C7C7] rounded-lg pl-4 py-3"
                    />
                  </div>

                  {/* Grand Total */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Grand Total</label>
                    <input
                      type="text"
                      value={priceSummary.grandTotal}
                      onChange={(e) => handlePriceSummaryChange("grandTotal", e.target.value)}
                      placeholder="Add Calculator"
                      className="text-xs text-[#00000099] border-2 border-[#C7C7C7] rounded-lg pl-4 py-3"
                    />
                  </div>
                </form>
              ) : tabState === "Add Product" ? (
                // =================== ADD PRODUCT FORM ===================
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  {/* Product Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Product Name</label>
                    <input
                      type="text"
                      value={productForm.productName}
                      onChange={(e) => handleProductChange("productName", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => handleProductChange("category", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option>Construction</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                    </select>
                  </div>

                  {/* Unit Measure */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Unit Measure</label>
                    <select
                      value={productForm.unitMeasure}
                      onChange={(e) => handleProductChange("unitMeasure", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option>Pcs</option>
                      <option>Kg</option>
                      <option>Box</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Quantity</label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => handleProductChange("quantity", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">City</label>
                    <select
                      value={productForm.city}
                      onChange={(e) => handleProductChange("city", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option>Houston</option>
                      <option>Dallas</option>
                      <option>Austin</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      type="text"
                      value={productForm.phone}
                      onChange={(e) => handleProductChange("phone", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Unit Price</label>
                    <input
                      type="text"
                      value={productForm.unitPrice}
                      onChange={(e) => handleProductChange("unitPrice", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Discount Applied</label>
                    <select
                      value={productForm.discount}
                      onChange={(e) => handleProductChange("discount", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option>5%</option>
                      <option>8%</option>
                      <option>10%</option>
                    </select>
                  </div>

                  {/* Tax */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tax Applied</label>
                    <select
                      value={productForm.tax}
                      onChange={(e) => handleProductChange("tax", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option>2%</option>
                      <option>5%</option>
                      <option>8%</option>
                    </select>
                  </div>

                </form>
              ) : tabState === "Customer Details" ? (
                // =================== CUSTOMER DETAILS FORM ===================
                <form className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  
                  {/* Customer Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Customer Name</label>
                    <input
                      type="text"
                      value={customerForm.customerName}
                      onChange={(e) => handleCustomerChange("customerName", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Company Name</label>
                    <input
                      type="text"
                      value={customerForm.companyName}
                      onChange={(e) => handleCustomerChange("companyName", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Delivery Address - Full Width */}
                  <div className="flex flex-col gap-1 sm:col-span-3">
                    <label className="text-sm font-medium">Delivery Address</label>
                    <input
                      type="text"
                      value={customerForm.deliveryAddress}
                      onChange={(e) => handleCustomerChange("deliveryAddress", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* City - 1st in row */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">City</label>
                    <select
                      value={customerForm.city}
                      onChange={(e) => handleCustomerChange("city", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option>Houston</option>
                      <option>Dallas</option>
                      <option>Austin</option>
                    </select>
                  </div>

                  {/* State - 2nd in row */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">State</label>
                    <input
                      type="text"
                      value={customerForm.state}
                      onChange={(e) => handleCustomerChange("state", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Postal Code - 3rd in row */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Postal Code</label>
                    <input
                      type="text"
                      value={customerForm.postalCode}
                      onChange={(e) => handleCustomerChange("postalCode", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={customerForm.email}
                      onChange={(e) => handleCustomerChange("email", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      type="text"
                      value={customerForm.phone}
                      onChange={(e) => handleCustomerChange("phone", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Special Instruction - Full Width */}
                  <div className="flex flex-col gap-1 sm:col-span-3">
                    <label className="text-sm font-medium">Special Instruction</label>
                    <textarea
                      value={customerForm.specialInstruction}
                      onChange={(e) => handleCustomerChange("specialInstruction", e.target.value)}
                      className="text-sm border-2 border-[#C7C7C7] rounded-lg px-4 py-2"
                      rows="3"
                    />
                  </div>

                </form>
              ) : (
                <p className="mt-4 text-sm text-gray-600">
                  Select a tab to continue
                </p>
              )}
            </div>

            {/* Submit Button Only Visible on Price Summary */}
            {tabState === "Price Summary" && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="bg-black text-white text-base rounded-lg py-2"
                onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            )}

            {/* Add New Product Button - Only Visible on Add Product Tab */}
            {tabState === "Add Product" && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  className="bg-black text-white text-base rounded-lg py-2"
                  onClick={handleAddProduct}
                >
                  Add New Product
                </button>
              </div>
            )}

            {/* Next Button - Only Visible on Customer Details Tab */}
            {tabState === "Customer Details" && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="bg-black text-white text-base rounded-lg py-2">
                  Next
                </button>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PREVIEW SECTION */}
        <div className="bg-[#C2C2C21F] flex flex-col rounded-lg border-2 border-[#C2C2C21F] px-5 pt-4 pb-5">
          <div className="flex justify-between items-center">
            <img src={Logo} alt="Logo" className="w-20 object-contain" />
            <p className="text-right text-sm font-semibold">
              19th Street, Mckinney Walker <br />
              Jaddah <br />
              +1-0281-856-6521
            </p>
          </div>

          <div className="flex justify-between border-b-2 border-[#008CFF] mt-3 pb-3">
            <p className="text-sm font-semibold leading-6">
              Invoice Number : INV-04568 <br />
              Date Issued : Nov 01, 2025 <br />
              Due Date : Nov 10, 2025 <br />
              07526
            </p>
            <p className="text-right text-sm font-semibold leading-6">
              {customerForm.customerName} <br />
              {customerForm.email} <br />
              {customerForm.city}, {customerForm.state} <br />
              {customerForm.postalCode}
            </p>
          </div>

          <p className="text-sm font-semibold leading-6 mt-3">
            Project Description:
            <br />
            <span className="font-normal">
              {customerForm.specialInstruction}
            </span>
          </p>

          <div className="flex flex-col gap-5 mt-3 flex-grow">
            <p className="font-semibold text-sm">Product Details :</p>

            <div className="grid grid-cols-6 gap-2 md:gap-[30px] text-center">
              {["S.no", "Product Name", "Quantity", "Unit Price", "Discount %", "Tax %"].map(
                (h, i) => (
                  <span
                    key={i}
                    className="bg-[#DCEEFF] text-sm rounded-2xl border-2 border-[#007AFF] text-[#007AFF] px-2 py-1"
                  >
                    {h}
                  </span>
                )
              )}
            </div>


            {/* Dynamic Products */}
            {products.length > 0 ? (
              <div className="grid grid-cols-6 gap-2 md:gap-[30px] text-center">
                {[
                  products.map((product, index) => (index + 1).toString().padStart(2, '0')),
                  products.map(product => product.productName),
                  products.map(product => `${product.quantity}${product.unitMeasure || 'pcs'}`),
                  products.map(product => `$${product.unitPrice}$`),
                  products.map(product => product.discount || '0%'),
                  products.map(product => product.tax || '0%')
                ].map((col, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    {col.map((item, j) => (
                      <span key={j} className="text-xs font-light">
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2 md:gap-[30px] text-center">
                {[
                  ["01", "02", "03", "04", "05"],
                  ["Gas torch", "Scrapers", "Sealant guns", "Heat gun", "Mixing paddles"],
                  ["60pcs", "45pcs", "30pcs", "80pcs", "15pcs"],
                  ["40.00$", "25.00$", "50.00$", "60.00$", "15.00$"],
                  ["6%", "2%", "3%", "4%", "5%"],
                  ["2%", "1%", "3%", "2%", "4%"],
                ].map((col, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    {col.map((item, j) => (
                      <span key={j} className="text-xs font-light">
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t-2 border-[#008CFF] pt-2 mt-4">
            <p className="text-sm font-semibold">Terms & Conditions :</p>
            <p className="text-sm font-normal">
              Above information is not an invoice and only an estimate.
            </p>
            <p className="text-sm font-semibold mt-1">
              Please Confirm Your Acceptance Of This Quote
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewInvoice;