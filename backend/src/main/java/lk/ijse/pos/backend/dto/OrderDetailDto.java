package lk.ijse.pos.backend.dto;

import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class OrderDetailDto {
    private String date;
    private String customerId;
    private String orderId;
    private String items;
    private double total;
}
