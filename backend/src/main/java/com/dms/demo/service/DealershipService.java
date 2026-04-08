package com.dms.demo.service;

import com.dms.demo.dto.request.DealershipRequest;
import com.dms.demo.dto.response.DealershipResponse;
import java.util.List;

public interface DealershipService {
    DealershipResponse createDealership(DealershipRequest request);
    DealershipResponse getDealershipById(Long id);
    List<DealershipResponse> getAllDealerships();
    DealershipResponse updateDealership(Long id, DealershipRequest request);
    void deleteDealership(Long id);
}
