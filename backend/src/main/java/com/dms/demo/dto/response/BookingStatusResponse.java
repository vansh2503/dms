package com.dms.demo.dto.response;

import com.dms.demo.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingStatusResponse {
    private BookingStatus status;
    private Long count;
}
