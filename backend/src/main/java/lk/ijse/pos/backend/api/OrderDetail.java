package lk.ijse.pos.backend.api;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.pos.backend.db.CustomerDB;
import lk.ijse.pos.backend.db.OrderDetailDB;
import lk.ijse.pos.backend.dto.CustomerDto;
import lk.ijse.pos.backend.dto.OrderDetailDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet(name = "order", value = "/orderDetail/*",
        loadOnStartup = 3
)
public class OrderDetail extends HttpServlet {
    final static Logger logger = LoggerFactory.getLogger(OrderDetail.class);
    Connection connection;
    OrderDetailDB orderDetailDB = new OrderDetailDB();

    @Override
    public void init() {
        logger.info("init the order detail servlet");
        try {
            InitialContext ctx = new InitialContext();
            DataSource pool = (DataSource) ctx.lookup("java:comp/env/jdbc/pos");
            this.connection = pool.getConnection();
            logger.info("connection initialized");
        } catch (NamingException | SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean checkContentType(HttpServletRequest req, HttpServletResponse resp) {
        if (req.getContentType() == null || !req.getContentType().toLowerCase().startsWith("application/json")) {
            try {
                resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return false;
        } else {
            return true;
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        if (checkContentType(req, resp)) {
            try {
                Jsonb jsonbB = JsonbBuilder.create();
                OrderDetailDto order = jsonbB.fromJson(req.getReader(), OrderDetailDto.class);
                orderDetailDB.saveOrder(order, connection);
            } catch (SQLException | IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        var action = req.getParameter("action");
        if (action.equals("all")) {
            try {
                var orders = orderDetailDB.getAllOrders(connection);
                Jsonb jsonb = JsonbBuilder.create();
                jsonb.toJson(orders, resp.getWriter());
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        } else if (action.equals("nextVal")) {
            try {
                resp.setContentType("text/html");
                resp.getWriter().print(orderDetailDB.generateNextOrderId(connection));
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String id = req.getParameter("id");
            orderDetailDB.deleteOrder(id,connection);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
//    @Override
//    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        if (checkContentType(req, resp)) {
//            try {
//                Jsonb jsonb = JsonbBuilder.create();
//                CustomerDto customer = jsonb.fromJson(req.getReader(), CustomerDto.class);
//                if (customerDB.updateCustomer(customer, connection)) {
//                    resp.setContentType("application/json");
//                    resp.getWriter().print(jsonb.toJson(customer));
//                }
//            } catch (SQLException e) {
//                throw new RuntimeException(e);
//            }
//        }
//    }
}
