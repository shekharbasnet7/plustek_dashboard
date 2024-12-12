package com.plustek.plustekdashboard.service;

import com.plustek.plustekdashboard.entity.Link;
import com.plustek.plustekdashboard.repo.LinkRepo;

public interface LinkService {


    void saveLink(Link link);


    Link findById(int id);
}
