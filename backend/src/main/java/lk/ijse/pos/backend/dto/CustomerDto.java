package lk.ijse.pos.backend.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class CustomerDto {
private String customerId;
private String customerName;
private String nic;
private int contact;
}
