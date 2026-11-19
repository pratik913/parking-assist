package com.parkingassist.parking;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.math.BigDecimal; import java.util.*;
import org.springframework.http.HttpStatus; import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal; import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
/** Geospatial discovery returns only active, verified inventory; search results never guarantee booking availability. */
@RestController @RequestMapping("/api/v1/parking") public class ParkingController {
 private final JdbcTemplate jdbc; public ParkingController(JdbcTemplate j){jdbc=j;}
 public record CreateListingRequest(@NotBlank @Size(max=120) String name,@NotBlank @Size(max=300) String address,
 @NotBlank @Size(max=100) String locality,@NotBlank @Size(max=100) String city,
 @NotNull @DecimalMin("0.00") @Digits(integer=8,fraction=2) BigDecimal hourlyRate,
 @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,
 @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude,
 @NotNull Boolean supportsTwoWheeler,@NotNull Boolean supportsFourWheeler){}
 public record ParkingSummary(String id,String name,String address,String locality,String city,String kind,String verificationStatus,BigDecimal hourlyRate,double distanceMeters){}
 @PostMapping @ResponseStatus(HttpStatus.CREATED)
 public Map<String,String> create(@Valid @RequestBody CreateListingRequest r,@AuthenticationPrincipal Jwt jwt){
  String id=UUID.randomUUID().toString();
  jdbc.update("INSERT INTO parking_listing(id,owner_user_id,name,address,locality,city,kind,verification_status,hourly_rate,location,supports_two_wheeler,supports_four_wheeler) VALUES (?::uuid,?::uuid,?,?,?,?, 'PRIVATE','PENDING',?,ST_SetSRID(ST_MakePoint(?,?),4326)::geography,?,?)",
  id,jwt.getSubject(),r.name(),r.address(),r.locality(),r.city(),r.hourlyRate(),r.longitude(),r.latitude(),r.supportsTwoWheeler(),r.supportsFourWheeler());
  return Map.of("id",id,"verificationStatus","PENDING");
 }
 @GetMapping("/nearby")
 public List<ParkingSummary> nearby(@RequestParam double latitude,@RequestParam double longitude,@RequestParam(defaultValue="5") double radiusKm,@RequestParam(defaultValue="FOUR_WHEELER") String vehicleType){
  if(latitude < -90||latitude>90||longitude < -180||longitude>180)throw new IllegalArgumentException("Invalid coordinates.");
  if(radiusKm<=0||radiusKm>50)throw new IllegalArgumentException("radiusKm must be between 0 and 50.");
  if(!List.of("TWO_WHEELER","FOUR_WHEELER").contains(vehicleType))throw new IllegalArgumentException("Unsupported vehicleType.");
  String col=vehicleType.equals("TWO_WHEELER")?"supports_two_wheeler":"supports_four_wheeler";
  String q=("SELECT id::text,name,address,locality,city,kind,verification_status,hourly_rate,ST_Distance(location,ST_SetSRID(ST_MakePoint(?,?),4326)::geography) d FROM parking_listing WHERE verification_status='VERIFIED' AND active=true AND "+col+"=true AND ST_DWithin(location,ST_SetSRID(ST_MakePoint(?,?),4326)::geography,?) ORDER BY d LIMIT 100");
  return jdbc.query(q,(rs,n)->new ParkingSummary(rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6),rs.getString(7),rs.getBigDecimal(8),rs.getDouble(9)),longitude,latitude,longitude,latitude,radiusKm*1000);
 }
}