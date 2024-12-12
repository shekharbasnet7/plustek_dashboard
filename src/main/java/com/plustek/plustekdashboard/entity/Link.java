package com.plustek.plustekdashboard.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String link;
    private String description;

    //Points to which kind like Folder/Directory, pdfs, docs, excel, powerponts, images
    // Enum type instead of String for pointsTo
    private PointsTo pointsTo;

    private LocalDateTime localDateTime;

    @ManyToOne
    private Category category;
}
