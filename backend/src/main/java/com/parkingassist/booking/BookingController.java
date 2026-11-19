package com.parkingassist.booking;
import jakarta.validation.Valid;import jakarta.validation.constraints.*;import java.time.Instant;import java.util.UUID;
import org.springframework.http.HttpStatus;import org.springframework.jdbc.core.JdbcTemplate;import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;import org.springframework.transaction.annotation.Transactional;import org.springframework.web.bind.annotation.*;
/** Temporary inventory holds. The database exclusion constraint is the final concurrency invariant. */
@RestController @RequestMapping("/api/v1/bookings") public class BookingController{
 private final JdbcTemplate db;public BookingController(JdbcTemplate d){db=d;}
 public record HoldRequest(@NotNull UUID parkingListingId,@NotNull @Future Instant startAt,@NotNull @Future Instant endAt){}
 public record BookingResponse(String id,String status,Instant holdExpiresAt){}
 @PostMapping("/holds") @ResponseStatus(HttpStatus.CREATED) @Transactional
 public BookingResponse hold(@Valid @RequestBody HoldRequest r,@AuthenticationPrincipal Jwt jwt){
  if(!r.endAt().isAfter(r.startAt()))throw new IllegalArgumentException("endAt must be after startAt.");
  if(r.endAt().isAfter(r.startAt().plusSeconds(604800)))throw new IllegalArgumentException("Booking cannot exceed seven days.");
  var listing=db.query("SELECT id FROM parking_listing WHERE id=? AND active=true AND verification_status='VERIFIED' FOR UPDATE",(rs,n)->rs.getObject(1),r.parkingListingId());
  if(listing.isEmpty())throw new IllegalArgumentException("Parking listing unavailable.");
  String id=UUID.randomUUID().toString();Instant expiry=Instant.now().plusSeconds(600);
  db.update("INSERT INTO booking(id,parking_listing_id,driver_user_id,start_at,end_at,status,hold_expires_at) VALUES (?::uuid,?::uuid,?::uuid,?,?,'HELD',?)",id,r.parkingListingId(),jwt.getSubject(),r.startAt(),r.endAt(),expiry);
  return new BookingResponse(id,"HELD",expiry);
 }
}