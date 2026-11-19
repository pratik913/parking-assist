package com.parkingassist.location;
import java.util.List;import java.util.Map;import org.springframework.beans.factory.annotation.Value;import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;import org.springframework.web.client.RestClient;import org.springframework.web.server.ResponseStatusException;
/** Reverse geocoding stays server-side so provider credentials are never exposed to the browser. */
@RestController @RequestMapping("/api/v1/locations") public class LocationController{
 private final RestClient client;private final String key;
 public LocationController(RestClient.Builder b,@Value("${app.geocoding.google-api-key:}")String k){client=b.baseUrl("https://maps.googleapis.com").build();key=k;}
 public record ReverseGeocodeResponse(String displayName){}
 @GetMapping("/reverse-geocode") public ReverseGeocodeResponse reverse(@RequestParam double latitude,@RequestParam double longitude){
  if(latitude < -90||latitude>90||longitude < -180||longitude>180)throw new IllegalArgumentException("Invalid coordinates.");
  if(key.isBlank())throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Reverse geocoding is not configured.");
  try{Map<?,?> body=client.get().uri(u->u.path("/maps/api/geocode/json").queryParam("latlng",latitude+","+longitude).queryParam("key",key).build()).retrieve().body(Map.class);
   if(body==null||!"OK".equals(body.get("status")))throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Area name not found.");
   List<?> results=(List<?>)body.get("results");if(results==null||results.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Area name not found.");
   return new ReverseGeocodeResponse(String.valueOf(((Map<?,?>)results.getFirst()).get("formatted_address")));
  }catch(ResponseStatusException e){throw e;}catch(Exception e){throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"Location provider request failed.");}
 }
}