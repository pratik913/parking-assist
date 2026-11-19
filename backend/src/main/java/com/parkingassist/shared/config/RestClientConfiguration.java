package com.parkingassist.shared.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * Provides the synchronous HTTP client builder used by server-side integrations.
 *
 * The webmvc starter does not guarantee a RestClient.Builder bean in every
 * dependency combination, so define one explicitly while allowing a future
 * application-specific or auto-configured builder to take precedence.
 */
@Configuration(proxyBeanMethods = false)
public class RestClientConfiguration {

    @Bean
    @ConditionalOnMissingBean(RestClient.Builder.class)
    RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }
}
