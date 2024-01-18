package lk.ijse.pos.backend.db;

import lk.ijse.pos.backend.dto.CustomerDto;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CustomerDB {

    Connection connection;
    final static String save = "INSERT INTO customer (customerId,customerName,nic,contact) VALUES (?,?,?,?)";
    final static String getAll = "SELECT * FROM customer";
    final static String getLastCustomerId = "SELECT customerId FROM customer ORDER BY customerId DESC LIMIT 1";
    final static String updateCustomer = "UPDATE customer SET customerName=?, nic=?, contact=? WHERE customerId=?";
    final static String deleteCustomer = "DELETE FROM customer WHERE customerId=?";

    public void saveCustomer(CustomerDto customer, Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(save);
        ps.setString(1, customer.getCustomerId());
        ps.setString(2, customer.getCustomerName());
        ps.setString(3, customer.getNic());
        ps.setInt(4, customer.getContact());

        if (ps.executeUpdate() != 0) {
            System.out.println("customer saved");
        } else {
            System.out.println("customer not saved");
        }
    }

    public List<CustomerDto> getAllCustomers(Connection connection) throws SQLException {
        var customerList = new ArrayList<CustomerDto>();
        this.connection = connection;
        var ps = connection.prepareStatement(getAll);
        var customers = ps.executeQuery();

        while (customers.next()) {
            customerList.add(new CustomerDto(
                    customers.getString(1),
                    customers.getString(2),
                    customers.getString(3),
                    customers.getInt(4)
            ));
        }
        return customerList;
    }

    public String generateNextCustomerId(Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(getLastCustomerId);
        var rs = ps.executeQuery();
        if (rs.next()) {
            String currentCustomerId = rs.getString(1);
            int numericPart = Integer.parseInt(currentCustomerId.substring(3));
            int nextNumericPart = numericPart + 1;
            return "C00" + nextNumericPart;
        }
        return "C001";
    }

    public boolean updateCustomer(CustomerDto customer, Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(updateCustomer);
        ps.setString(1, customer.getCustomerName());
        ps.setString(2, customer.getNic());
        ps.setInt(3, customer.getContact());
        ps.setString(4, customer.getCustomerId());

        if (ps.executeUpdate() != 0) {
            System.out.println("customer updated");
            return false;
        } else {
            System.out.println("customer not updated");
            return true;
        }
    }

    public void deleteCustomer(String id, Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(deleteCustomer);
        ps.setString(1, id);
        if (ps.executeUpdate() != 0) {
            System.out.println("customer deleted");
        } else {
            System.out.println("customer not deleted");
        }
    }
}
