package lk.ijse.pos.backend.db;

import lk.ijse.pos.backend.dto.OrderDetailDto;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class OrderDetailDB {
    Connection connection;
    final static String save = "INSERT INTO orderDetail (date,customerId,orderId,items,total) VALUES (?,?,?,?,?)";
    final static String getAll = "SELECT * FROM orderDetail";
    final static String getLastOrderId = "SELECT orderId FROM orderDetail ORDER BY orderId DESC LIMIT 1";
    final static String deleteOrder = "DELETE FROM orderdetail WHERE orderId=?";

    public void saveOrder(OrderDetailDto order, Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(save);
        ps.setObject(1, formatStringToDate(order.getDate()));
        ps.setString(2, order.getCustomerId());
        ps.setString(3, order.getOrderId());
        ps.setString(4, order.getItems());
        ps.setDouble(5, order.getTotal());

        if (ps.executeUpdate() != 0) {
            System.out.println("order saved");
        } else {
            System.out.println("order not saved");
        }
    }

    public LocalDateTime formatStringToDate(String stringDate) {
        DateTimeFormatter parser = new DateTimeFormatterBuilder()
                .parseCaseInsensitive()
                .appendPattern("M/d/yyyy, h:mm:ss a")
                .toFormatter(Locale.US);
        LocalDateTime parsedDateTime = LocalDateTime.parse(stringDate, parser);
        return parsedDateTime;
    }

    public String formatDateTOString(LocalDateTime date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = date.format(formatter);
        return formattedDateTime;
    }

    public List<OrderDetailDto> getAllOrders(Connection connection) throws SQLException {
        var orderList = new ArrayList<OrderDetailDto>();
        this.connection = connection;
        var ps = connection.prepareStatement(getAll);
        var orders = ps.executeQuery();

        while (orders.next()) {
            orderList.add(new OrderDetailDto(
                    formatDateTOString((LocalDateTime) orders.getObject(1)),
                    orders.getString(2),
                    orders.getString(3),
                    orders.getString(4),
                    orders.getDouble(5)
            ));
        }
        return orderList;
    }

    public String generateNextOrderId(Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(getLastOrderId);
        var rs = ps.executeQuery();
        if (rs.next()) {
            String currentOrderId = rs.getString(1);
            int numericPart = Integer.parseInt(currentOrderId.substring(3));
            int nextNumericPart = numericPart + 1;
            return "O00" + nextNumericPart;
        }
        return "O001";
    }

    public void deleteOrder(String id, Connection connection) throws SQLException {
        this.connection = connection;
        var ps = connection.prepareStatement(deleteOrder);
        ps.setString(1, id);
        if (ps.executeUpdate() != 0) {
            System.out.println("order deleted");
        } else {
            System.out.println("order not deleted");
        }
    }
}
