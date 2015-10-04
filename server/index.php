<?php
header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: must-revalidate");
header("Pragma: no-cache");
header("Expires: -1");
	
$tripboard_json = file_get_contents('tripboard.json');
$tripboard_data = json_decode($tripboard_json,true);

if(!isset($_GET['type'])){
	$tripboard_json = file_get_contents('tripboard_init.json');
	file_put_contents('tripboard.json',$tripboard_json);
	echo $tripboard_json;
	return false;
}
$DATA = json_decode(file_get_contents('php://input'), true);

switch ($_GET['type']) {
	case 'editpoint':
		foreach ($tripboard_data['tripBoard']['points'] as $key => $point) {
			if($point['id'] == $DATA['pointId']){
				$point['startDate'] = $DATA['startDate'];
				$point['endDate'] = $DATA['endDate'];

				$tripboard_data['tripBoard']['points'][$key] = $point;
			}
		}
		$tripboard_json = json_encode($tripboard_data);
		echo $tripboard_json;
		file_put_contents('tripboard.json',$tripboard_json);
		break;

	case 'addpoint':
		$point = array(
			"id" => count($tripboard_data['tripBoard']['points']) + 1,
	        "startDate" => $DATA['startDate'],
	        "endDate" => $DATA['endDate'],
	        "city" => array(
	        	"coordinates" => $DATA['coordinates'],
	          	"name" => $DATA['cityName']
	        ),
	        "country" => array("name" => $DATA['countryName']),
	        "accomodations" => array(),
	        "activities" => array(),
	        "notes" => array()
		);
		$tripboard_data['tripBoard']['points'][] = $point;

		$tripboard_json = json_encode($tripboard_data);
		echo $tripboard_json;
		file_put_contents('tripboard.json',$tripboard_json);
		break;

	case 'edittransfer':
		foreach ($tripboard_data['tripBoard']['transfers'] as $key => $transfer) {
			if($transfer['id'] == $DATA['transferId']){
				$transfer['startDate'] = $DATA['startDate'];
				$transfer['transferTypes'] = $DATA['transferTypes'];

				$tripboard_data['tripBoard']['transfers'][$key] = $transfer;
				break;
			}
		}

		$tripboard_json = json_encode($tripboard_data);
		echo $tripboard_json;
		file_put_contents('tripboard.json',$tripboard_json);
		break;

	case 'addAccommodation':
		foreach ($tripboard_data['tripBoard']['points'] as $key => $point) {
			if($point['id'] == $DATA['pointId']){
				if(!array_key_exists('accommodations',$point)) $point['accommodations'] = array();
				$point['accommodations'][] = array(
					"id" => (count($point['accommodations']) + 1),
					"checkIn" => $DATA['checkIn'],
					"checkOut" => $DATA['checkOut'],
					"accommodationTypes" => $DATA['accommodationTypes'],
					"locationTypes" => $DATA['locationTypes']
				);
				$tripboard_data['tripBoard']['points'][$key] = $point;
				break;
			}
		}
		$tripboard_json = json_encode($tripboard_data);
		echo $tripboard_json;
		file_put_contents('tripboard.json',$tripboard_json);
		break;

	case 'removeAccommodation':

		foreach ($tripboard_data['tripBoard']['points'] as $key => $point) {
			if($point['id'] == $DATA['pointId']){
				if(!array_key_exists('accommodations',$point)) break;
				foreach ($point['accommodations'] as $akey => $accomodation) {
					if($accomodation['id'] == $DATA['accommodationId']){
						array_splice($point['accommodations'], $akey, 1);
						break;
					}
				}
				$tripboard_data['tripBoard']['points'][$key] = $point;
				break;
			}
		}

		$tripboard_json = json_encode($tripboard_data);
		echo $tripboard_json;
		file_put_contents('tripboard.json',$tripboard_json);
		break;

	case 'editAccommodation':

		foreach ($tripboard_data['tripBoard']['points'] as $key => $point) {
			if($point['id'] == $DATA['pointId']){
				if(!array_key_exists('accommodations',$point)) break;
				foreach ($point['accommodations'] as $akey => $accomodation) {
					if($accomodation['id'] == $DATA['accommodationId']){
						$point['accommodations'][$akey] = array(
							"id" => $DATA['accommodationId'],
							"checkIn" => $DATA['checkIn'],
							"checkOut" => $DATA['checkOut'],
							"accommodationTypes" => $DATA['accommodationTypes'],
							"locationTypes" => $DATA['locationTypes']
						);
						break;
					}
				}
				$tripboard_data['tripBoard']['points'][$key] = $point;
				break;
			}
		}

		$tripboard_json = json_encode($tripboard_data);
		echo $tripboard_json;
		file_put_contents('tripboard.json',$tripboard_json);
		break;
	
	default:
		$tripboard_json = file_get_contents('tripboard_init.json');
		file_put_contents('tripboard.json',$tripboard_json);
		echo $tripboard_json;
		break;
}