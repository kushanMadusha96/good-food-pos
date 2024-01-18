package lk.ijse.pos.backend.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ItemDto {
    private String itemId;
    private String itemName;
    private double price;
    private double qty;
}
