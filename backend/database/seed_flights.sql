DO $$
DECLARE
    -- loop variables
    day_offset INTEGER;
    origin_idx INTEGER;
    dest_idx INTEGER;
    flights_per_route INTEGER := 2;
    k INTEGER;
    
    -- data variables
    v_airline TEXT;
    v_aircraft TEXT;
    v_origin_name TEXT;
    v_origin_code TEXT;
    v_dest_name TEXT;
    v_dest_code TEXT;
    v_flight_num TEXT;
    
    -- temporal variables
    v_base_date DATE := '2025-12-20'; 
    v_date_current DATE;
    v_departure TIMESTAMP;
    v_arrival TIMESTAMP;
    v_duration_mins INT;
    v_duration_text TEXT;
    
    -- price/status variables
    v_price NUMERIC(10,2);
    v_stops INT;
    
    -- DATA
    arr_airlines TEXT[] := ARRAY[
        'SEU Airlines', 'China Eastern', 'Air China', 'Air France', 
        'Emirates', 'ANA', 'Lufthansa', 'British Airways', 
        'Cathay Pacific', 'Delta Airlines', 'Qatar Airways', 'Singapore Airlines'
    ];
    
    arr_aircrafts TEXT[] := ARRAY[
        'Airbus A320', 'Airbus A330', 'Airbus A350', 
        'Boeing 737', 'Boeing 787', 'Boeing 777'
    ];
    
    arr_cities TEXT[] := ARRAY['Paris', 'Beijing', 'Shanghai', 'New York', 'Tokyo', 'Dubai', 'London', 'Sydney', 'Nanjing', 'Los Angeles'];
    arr_codes TEXT[] := ARRAY['CDG', 'PEK', 'PVG', 'JFK', 'HND', 'DXB', 'LHR', 'SYD', 'NKG', 'LAX'];

BEGIN
    -- 1. LOOP OVER DAYS (from 20 to 30 = 11 days)
    FOR day_offset IN 0..10 LOOP
        v_date_current := v_base_date + day_offset;
        
        -- 2. LOOP OVER ORIGIN CITY
        FOR origin_idx IN 1..array_length(arr_cities, 1) LOOP
            
            -- 3. LOOP OVER DESTINATION CITY
            FOR dest_idx IN 1..array_length(arr_cities, 1) LOOP
                
                -- Skip if origin == destination
                IF origin_idx != dest_idx THEN
                    
                    v_origin_name := arr_cities[origin_idx];
                    v_origin_code := arr_codes[origin_idx];
                    v_dest_name := arr_cities[dest_idx];
                    v_dest_code := arr_codes[dest_idx];

                    -- 4. GENERATION OF MULTIPLE FLIGHTS PER ROUTE (Morning and Evening)
                    FOR k IN 1..flights_per_route LOOP
                        
                        -- Calculation of departure time
                        -- If k=1 (Morning) : between 06:00 and 11:59
                        -- If k=2 (Evening) : between 13:00 and 22:59
                        IF k = 1 THEN
                            v_departure := v_date_current + ('06:00:00'::time + (random() * interval '6 hours'));
                        ELSE
                            v_departure := v_date_current + ('13:00:00'::time + (random() * interval '10 hours'));
                        END IF;

                        -- Coherent random duration (between 2h and 14h)
                        v_duration_mins := 120 + floor(random() * 720);
                        v_duration_text := (v_duration_mins / 60)::TEXT || 'h ' || (v_duration_mins % 60)::TEXT || 'm';
                        
                        -- Arrival
                        v_arrival := v_departure + (v_duration_mins || ' minutes')::INTERVAL;

                        -- Random airline and aircraft
                        v_airline := arr_airlines[floor(random() * array_length(arr_airlines, 1) + 1)];
                        v_aircraft := arr_aircrafts[floor(random() * array_length(arr_aircrafts, 1) + 1)];
                        
                        -- Flight number (e.g., AF4932)
                        v_flight_num := substring(upper(v_airline) from 1 for 2) || (1000 + floor(random() * 8999))::TEXT;

                        -- Price based on duration + random variation
                        v_price := 300 + (v_duration_mins * 8) + (random() * 200);

                        -- Stops
                        IF random() < 0.6 THEN v_stops := 0; ELSE v_stops := 1; END IF;

                        -- INSERTION
                        INSERT INTO public.flights (
                            flight_number, airline, origin, origin_code, destination, destination_code,
                            departure_time, arrival_time, duration, stops, base_price,
                            aircraft, baggage, refundable, seat_selection, status
                        ) VALUES (
                            v_flight_num,
                            v_airline,
                            v_origin_name,
                            v_origin_code,
                            v_dest_name,
                            v_dest_code,
                            v_departure,
                            v_arrival,
                            v_duration_text,
                            v_stops,
                            round(v_price, 2),
                            v_aircraft,
                            '23kg',
                            (random() > 0.7), -- 30% are refundable
                            'Available',
                            'SCHEDULED'
                        );
                        
                    END LOOP; -- End multiple flights loop
                END IF;
            END LOOP; -- End destination loop
        END LOOP; -- End origin loop
    END LOOP; -- End days loop
END $$;