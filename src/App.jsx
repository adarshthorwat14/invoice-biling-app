import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddClientForm from './components/Clients/AddClientForm'
import ViewClients from './components/Clients/ViewClients'
import UpdateClient from './components/Clients/UpdateClient'
import ViewProducts from './components/Products/ViewProducts'
import AddProductForm from './components/Products/AddProductForm'
import UpdateProduct from './components/Products/UpdateProduct'
import InvoiceList from './components/Invoices/InvoiceList'

import CreateInvoiceForm from './components/Invoices/CreateInvoiceForm';

import CreateAdmin from './components/Admin/CreateAdmin';
import Login from './components/Login/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ClientDashboard from './components/ClientDashboard/ClientDashboard';
import AdminHome from './components/Home/AdminHome';
import ProductMngDashboard from './components/ProductMngDashboard/ProductMngDashboard';
import CreateProductMngForm from './components/Products/ProductManagement/CreateProductMngForm';
import HomePagePM from './components/Home/HomePagePM';
import DistributorDashboard from './components/DistributorDashboard/DistributorDashboard';
import DistributorForm from './components/Distributor/DistributorForm';
import DistributorHome from './components/Home/DistributorHome';
import ViewDistClient from './components/Distributor/ViewDistClients';
import ClientInvoiceList from './components/Invoices/ClientInvoiceList';
import CreateProductRequest from './components/Distributor/CreateProductRequest';
import ProductRequest from './components/Products/ProductManagement/ProductRequest';
import RequestStockStatus from './components/Distributor/RequestStockStatus';
import DistributorCurrentStock from './components/Distributor/DistributorCurrentStock';
import ClientStockHistory from './components/Distributor/ClientStockHistory';
import DistributorStock from './components/Admin/DistributorStock';
import ClientPaymentStatus from './components/Distributor/ClientPaymentStatus';
import UserManagement from './components/Admin/UserManagement';
import ViewDistributors from './components/Distributor/ViewDistributors';
import CreateLogisticHead from './components/Logistic/CreateLogisticHead';
import LogisticDashboard from './components/LogisticDashborad/LogisticDashboard';
import LogisticHome from './components/Home/LogisticHome';
import RegisterVehicle from './components/Logistic/RegisterVehicle';
import ViewVehicles from './components/Logistic/ViewVehicles';
import UpdateVehicle from './components/Logistic/UpdateVehicle';
import MaintainHSN from './components/Products/ProductManagement/MaintainHSN';
import PlantManagement from './components/Logistic/PlantManagement';
import DeliveryRequest from './components/Logistic/DeliveryRequest';
import WarehouseStock from './components/Logistic/WarehouseStock';
import CreatePlantEmployee from './components/Plant/CreatePlantEmployee';
import PlantDashboard from './components/Plant/PlantDashboard';
import PlantHome from './components/Home/PlantHome';
import PlantProductRequests from './components/Sales/PlantProductRequests';
import DeliveryNotes from './components/Plant/DeliveryNotes';
import LogisticsDeliveryNotes from './components/Logistic/LogisticsDeliveryNotes';
import VehicleRequestApprovals from './components/Vehicle/VehicleRequestApprovals';
import ApprovedVehicleDispatch from './components/DispatchDpt/ApprovedVehicleDispatch';
import GatePassView from './components/Vehicle/GatePassView';
import VehicleRequests from './components/Vehicle/VehicleRequests';
import PlantStockPage from './components/Products/PlantStockPage';
import CreateSalesperson from './components/Admin/CreateSalesperson';
import SalesDashboard from './components/Sales/SalesDashboard';
import DistributorDeliveryNote from './components/Distributor/DistributorDeliveryNote';
const App = () => {
  return (
    <Router>
   
      <div className="app-content">
        <Routes>

          <Route path="/" element={<Login/>} />




          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}

         <Route
          path="/productMng/create"
          element={
            <AdminDashboard>
              <CreateProductMngForm />
            </AdminDashboard>
          }
        />

         <Route
          path="/productMng/home"
          element={
            <ProductMngDashboard>
             <HomePagePM/>
            </ProductMngDashboard>
          }
        />

           <Route
          path="/admin/create"
          element={
            <AdminDashboard>
              <CreateAdmin />
            </AdminDashboard>
          }
        />

        <Route
          path="/admin/home"
          element={
            <AdminDashboard>
              <AdminHome/>
            </AdminDashboard>
          }
        />



          {/* <Route path="/admin" element={<CreateAdmin />} /> */}

          {/* <Route path="/clients" element={<ClientDashboard />}></Route> */}

          {/* <Route path="/home" element={} /> */}

           

           <Route
          path="/clients"
          element={
            <AdminDashboard>
              <ViewClients />
            </AdminDashboard>
          }
        />
          {/* <Route path="/clients/add" element={<AddClientForm/>} /> */}

           <Route
          path="/clients/add"
          element={
            <AdminDashboard>
              <AddClientForm />
            </AdminDashboard>
          }
        />

          {/* <Route path="/clients/update" element={<UpdateClient/>} /> */}

           <Route
          path="/clients/update"
          element={
            <AdminDashboard>
              <UpdateClient />
            </AdminDashboard>
          }
        />

          {/* <Route path="/products" element={<ViewProducts/>} /> */}
          <Route
          path="/products"
          element={
            <AdminDashboard>
              <ViewProducts />
            </AdminDashboard>
          }
        />
          <Route
          path="/salesperson/create"
          element={
            <AdminDashboard>
              <CreateSalesperson />
            </AdminDashboard>
          }
        />

          {/* <Route path="/products/add" element={<AddProductForm/>} /> */}
              <Route
          path="/products/add"
          element={
            <AdminDashboard>
              <AddProductForm />
            </AdminDashboard>
          }
        />

           <Route
          path="/distributor/create"
          element={
            <AdminDashboard>
              <DistributorForm/>
            </AdminDashboard>
          }
        />
          {/* <Route path="/products/update" element={<UpdateProduct/>} /> */}

                  <Route
          path="/products/update"
          element={
            <AdminDashboard>
              <UpdateProduct />
            </AdminDashboard>
          }
        />

         <Route
          path="/admin/invoice/list"
          element={
            <AdminDashboard>
              <InvoiceList />
            </AdminDashboard>
          }
        />

        <Route
          path="/admin/user"
          element={
            <AdminDashboard>
              <UserManagement />
            </AdminDashboard>
          }
        />

        <Route
          path="/admin/distributors"
          element={
            <AdminDashboard>
              <ViewDistributors />
            </AdminDashboard>
          }
        />
        <Route
          path="/logistic/create"
          element={
            <AdminDashboard>
              <CreateLogisticHead />
            </AdminDashboard>
          }
        />

         <Route
          path="/plant/employee/create"
          element={
            <AdminDashboard>
              <CreatePlantEmployee />
            </AdminDashboard>
          }
        />

          <Route
          path="/admin/distributor/stock"
          element={
            <AdminDashboard>
              <DistributorStock />
            </AdminDashboard>
          }
        />


        <Route
          path="/productMng/products/view"
          element={
            <ProductMngDashboard>
              <ViewProducts />
            </ProductMngDashboard>
          }
        />

          {/* <Route path="/products/add" element={<AddProductForm/>} /> */}
              <Route
          path="/productMng/products/add"
          element={
            <ProductMngDashboard>
              <AddProductForm />
            </ProductMngDashboard>
          }
        />

          {/* <Route path="/products/update" element={<UpdateProduct/>} /> */}

          <Route
          path="/productMng/products/update"
          element={
            <ProductMngDashboard>
              <UpdateProduct />
            </ProductMngDashboard>
          }
        />

           <Route
          path="/productMng/distributor/stock"
          element={
             <ProductMngDashboard>
              <DistributorStock />
           </ProductMngDashboard>
          }
        />
         <Route
          path="/productMng/products/request"
          element={
            <ProductMngDashboard>
              <ProductRequest />
            </ProductMngDashboard>
          }
        />
         <Route
          path="/productMng/maintain/hsn"
          element={
            <ProductMngDashboard>
              <MaintainHSN />
            </ProductMngDashboard>
          }
        />
         <Route
          path="management/plant/stock-view"
          element={
            <ProductMngDashboard>
              <PlantStockPage />
            </ProductMngDashboard>
          }
        />

          {/* <Route path="/invoices/list" element={<InvoiceList/>} /> */}
           <Route
          path="/home"
          element={
            <ClientDashboard>
             <Home />
            </ClientDashboard>
          }
        />
          <Route
          path="/invoices/create"
          element={
            <ClientDashboard>
              <CreateInvoiceForm />
            </ClientDashboard>
          }
        />
        <Route
          path="/invoices/list"
          element={
            <ClientDashboard>
              <ClientInvoiceList />
            </ClientDashboard>
          }
        />


          {/* <Route path="/invoices/create" element={<CreateInvoiceForm/>} /> */}

            <Route
          path="/client/invoices/list"
          element={
            <ClientDashboard>
              <InvoiceList />
            </ClientDashboard>
          }
        />

       


          <Route
          path="/distributor/home"
          element={
            <DistributorDashboard>
              <DistributorHome/>
            </DistributorDashboard>
          }
        /> 

        <Route
          path="/distributor/products/view"
          element={
            <DistributorDashboard>
              <ViewProducts />
            </DistributorDashboard>
          }
        />

        <Route
          path="/distributor/clients"
          element={
            <DistributorDashboard>
              <ViewDistClient/>
            </DistributorDashboard>
          }
        />

           <Route
          path="distributor/client/add"
          element={
            <DistributorDashboard>
              <AddClientForm />
            </DistributorDashboard>
          }
        />

        <Route
          path="/distributor/productRequest"
          element={
            <DistributorDashboard>
              <CreateProductRequest/>
            </DistributorDashboard>
          }
        />
        <Route
          path="/distributor/requestStatus"
          element={
            <DistributorDashboard>
              <RequestStockStatus/>
            </DistributorDashboard>
          }
        />

         <Route
          path="/distributor/currentStock"
          element={
            <DistributorDashboard>
              <DistributorCurrentStock/>
            </DistributorDashboard>
          }
        />

          <Route
          path="/distributor/client/payment-status"
          element={
            <DistributorDashboard>
              <ClientPaymentStatus/>
            </DistributorDashboard>
          }
        />

          <Route
          path="/distributor/client/history"
          element={
            <DistributorDashboard>
              <ClientStockHistory/>
            </DistributorDashboard>
          }
        />  
          <Route
          path="/distributor/delivery_note"
          element={
            <DistributorDashboard>
              <DistributorDeliveryNote/>
            </DistributorDashboard>
          }
        />  

        <Route
          path="/logistic/home"
          element={
            <LogisticDashboard>
              <LogisticHome/>
            </LogisticDashboard>
          }
        />

         <Route
          path="/logistic/register-vehicle"
          element={
            <LogisticDashboard>
              <RegisterVehicle/>
            </LogisticDashboard>
          }
        />

         <Route
          path="/logistic/view-vehicles"
          element={
            <LogisticDashboard>
              <ViewVehicles/>
            </LogisticDashboard>
          }
        />

        <Route
          path="/logistic/update-vehicles"
          element={
            <LogisticDashboard>
              <UpdateVehicle/>
            </LogisticDashboard>
          }
        />
        <Route
          path="/logistic/add/plant"
          element={
            <LogisticDashboard>
              <PlantManagement/>
            </LogisticDashboard>
          }
        />
        <Route
          path="/logistic/delivery/request"
          element={
            <LogisticDashboard>
              <LogisticsDeliveryNotes/>
            </LogisticDashboard>
          }
        />
        <Route
          path="/logistic/vehicle_requests/status"
          element={
            <LogisticDashboard>
              <VehicleRequests/>
            </LogisticDashboard>
          }
        />
        <Route
          path="/vehicle/vehicle/request"
          element={
            <LogisticDashboard>
              <VehicleRequestApprovals/>
            </LogisticDashboard>
          }
        />
        <Route
          path="/vehicle/vehicle/dispatch"
          element={
            <LogisticDashboard>
              <ApprovedVehicleDispatch/>
            </LogisticDashboard>
          }
        />
         <Route
          path="/logistic/warehouse/stock"
          element={
            <LogisticDashboard>
              <WarehouseStock/>
            </LogisticDashboard>
          }
        />
         <Route
          path="/logistic/gate-pass"
          element={
            <LogisticDashboard>
              <GatePassView/>
            </LogisticDashboard>
          }
        />

          <Route
          path="/plant/home"
          element={
            <PlantDashboard>
              <PlantHome/>
            </PlantDashboard>
          }
        />
        <Route
          path="/plant/stock-view"
          element={
            <PlantDashboard>
              <PlantStockPage />
            </PlantDashboard>
          }
        />
        

        <Route
          path="/delivery-notes"
          element={
            <PlantDashboard>
              <DeliveryNotes/>
            </PlantDashboard>
          }
        />

           <Route
          path="/sales/home"
          element={
            <SalesDashboard>
             <Home />
            </SalesDashboard>
          }
        />
        <Route
          path="/plant/distributor/product/request"
          element={
            <PlantDashboard>
              <PlantProductRequests/>
            </PlantDashboard>
          }
        />

        <Route
          path="/sales/distributors-orders"
          element={
            <SalesDashboard>
              <PlantProductRequests/>
            </SalesDashboard>
          }
        />

        </Routes>
      </div>
    </Router>

  );
};

export default App;