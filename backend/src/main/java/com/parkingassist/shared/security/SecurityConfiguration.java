package com.parkingassist.shared.security;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets; import java.util.List;
import javax.crypto.SecretKey; import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value; import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod; import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity; import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm; import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain; import org.springframework.web.cors.*;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
/** Stateless bearer-token security. Cookie-based refresh authentication needs a separate CSRF-aware design. */
@Configuration public class SecurityConfiguration {
 @Bean SecretKey jwtSecretKey(@Value("${app.security.jwt-secret}") String secret) {
  byte[] b=secret.getBytes(StandardCharsets.UTF_8); if(b.length<32) throw new IllegalStateException("APP_JWT_SECRET must be at least 32 bytes.");
  return new SecretKeySpec(b,"HmacSHA256");
 }
 @Bean JwtEncoder jwtEncoder(SecretKey k){return new NimbusJwtEncoder(new ImmutableSecret<>(k));}
 @Bean JwtDecoder jwtDecoder(SecretKey k){return NimbusJwtDecoder.withSecretKey(k).macAlgorithm(MacAlgorithm.HS256).build();}
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity h)throws Exception{
  return h.csrf(c->c.disable()).cors(Customizer.withDefaults()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/actuator/health/**","/v3/api-docs/**","/swagger-ui/**").permitAll()
   .requestMatchers(HttpMethod.POST,"/api/v1/auth/register","/api/v1/auth/login").permitAll()
   .requestMatchers(HttpMethod.GET,"/api/v1/parking/nearby","/api/v1/locations/reverse-geocode").permitAll().anyRequest().authenticated())
   .oauth2ResourceServer(o->o.jwt(Customizer.withDefaults())).build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins}") List<String> origins){
  CorsConfiguration c=new CorsConfiguration(); c.setAllowedOrigins(origins); c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
  c.setAllowedHeaders(List.of("Authorization","Content-Type","Idempotency-Key","X-Request-Id")); c.setAllowCredentials(false);
  UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;
 }
}