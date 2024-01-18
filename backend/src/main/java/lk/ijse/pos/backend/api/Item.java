package lk.ijse.pos.backend.api;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.pos.backend.db.ItemDB;
import lk.ijse.pos.backend.dto.ItemDto;
import lk.ijse.pos.backend.dto.ItemQtyDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "item", value = "/item/*",
        loadOnStartup = 3
)
public class Item extends HttpServlet {
    final static Logger logger = LoggerFactory.getLogger(Item.class);
    Connection connection;
    ItemDB itemDB = new ItemDB();

    @Override
    public void init() {
        logger.info("init the item servlet");
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
                ItemDto item = jsonbB.fromJson(req.getReader(), ItemDto.class);
                itemDB.saveItem(item, connection);
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
                var items = itemDB.getAllItem(connection);
                Jsonb jsonb = JsonbBuilder.create();
                jsonb.toJson(items, resp.getWriter());
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        } else if (action.equals("nextVal")) {
            try {
                resp.setContentType("text/html");
                resp.getWriter().print(itemDB.generateNextItemId(connection));
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                resp.setContentType("text/html");
                resp.getWriter().print(itemDB.getCurrentQtyById(action, connection));
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        var param = req.getParameter("reduce");

        if (checkContentType(req, resp)) {
            Jsonb jsonb = JsonbBuilder.create();
            if (param != null) {
                try {
                    List<ItemQtyDto> itemQtyObjArray = jsonb.fromJson(req.getReader(),new ArrayList<ItemQtyDto>(){}.getClass().getGenericSuperclass());
                    itemDB.reduceItemCount(itemQtyObjArray, connection);
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            } else {
                try {
                    ItemDto item = jsonb.fromJson(req.getReader(), ItemDto.class);
                    if (itemDB.updateItem(item, connection)) {
                        resp.setContentType("application/json");
                        resp.getWriter().print(jsonb.toJson(item));
                    }
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String id = req.getParameter("id");
            itemDB.deleteItem(id, connection);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
