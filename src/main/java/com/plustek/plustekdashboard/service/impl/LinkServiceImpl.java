package com.plustek.plustekdashboard.service.impl;

import com.plustek.plustekdashboard.entity.Link;
import com.plustek.plustekdashboard.repo.LinkRepo;
import com.plustek.plustekdashboard.service.LinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LinkServiceImpl implements LinkService {

    @Autowired
    LinkRepo linkRepo;

    @Override
    public void saveLink(Link link) {

        linkRepo.save(link);

    }

    @Override
    public Link findById(int id) {
        return linkRepo.findById(id).orElse(null);
    }
}
