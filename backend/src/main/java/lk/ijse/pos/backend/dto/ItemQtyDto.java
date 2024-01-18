package lk.ijse.pos.backend.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ItemQtyDto {
    private String itemId;
    private double qty;
}
