package com.parkingassist.identity;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.time.Instant; import java.util.UUID;
import org.springframework.http.HttpStatus; import org.springframework.jdbc.core.JdbcTemplate; import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm; import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;
/** Account credentials are hashed at rest; access JWTs are intentionally short lived (15 minutes). */
@RestController @RequestMapping("/api/v1/auth") public class IdentityController{
 private final JdbcTemplate db;private final PasswordEncoder encoder;private final JwtEncoder jwt;
 public IdentityController(JdbcTemplate d,PasswordEncoder e,JwtEncoder j){db=d;encoder=e;jwt=j;}
 public record RegisterRequest(@NotBlank @Size(max=80) String fullName,@Email @NotBlank @Size(max=254) String email,@NotBlank @Size(min=10,max=72) String password){}
 public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
 public record TokenResponse(String accessToken,String tokenType,long expiresInSeconds,String userId){}
 @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
 public TokenResponse register(@Valid @RequestBody RegisterRequest r){
  String id=UUID.randomUUID().toString();db.update("INSERT INTO app_user(id,full_name,email,password_hash) VALUES (?::uuid,?,?,?)",id,r.fullName().trim(),r.email().trim().toLowerCase(),encoder.encode(r.password()));
  return token(id,r.email().trim().toLowerCase());
 }
 @PostMapping("/login") public TokenResponse login(@Valid @RequestBody LoginRequest r){
  var rows=db.query("SELECT id::text,email,password_hash,status FROM app_user WHERE email=?",(rs,n)->new String[]{rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4)},r.email().trim().toLowerCase());
  if(rows.isEmpty()||!"ACTIVE".equals(rows.getFirst()[3])||!encoder.matches(r.password(),rows.getFirst()[2]))throw new IllegalArgumentException("Invalid email or password.");
  return token(rows.getFirst()[0],rows.getFirst()[1]);
 }
 private TokenResponse token(String id,String email){Instant now=Instant.now();long ttl=900;
  var claims=JwtClaimsSet.builder().issuer("parking-assist").subject(id).issuedAt(now).expiresAt(now.plusSeconds(ttl)).claim("email",email).claim("scope","ROLE_DRIVER").build();
  String value=jwt.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),claims)).getTokenValue();return new TokenResponse(value,"Bearer",ttl,id);
 }
}