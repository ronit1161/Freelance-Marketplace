package com.freelancemarketplace.common.logger.logrequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LogRequest 
{
	private String message;
    private String service;
    private String level;
}
