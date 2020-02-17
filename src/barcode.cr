# TODO: Write documentation for `Barcode`
require "kemal"
require "kemal-session"

ROOT_PATH = "/Users/luis/Desktop/Code/Crystal/apps"
# ROOT_PATH = "/var/www/domains/mischicanadas/subdomains/app"

PUBLIC_PATH   = "#{ROOT_PATH}/barcode/public"
PORT = 3026

public_folder PUBLIC_PATH

module Barcode
  VERSION = "0.1.0"

  # TODO: Put your code here
  Kemal::Session.config.secret = "9e7abe8ae041296820a0b69ef0e4a397c87f5866f454d35d432840bc98cfd789439addc260bb6f9a058e88faa7e4a4e416e39d05273f459dd3373dc6387cf69c"

  static_headers do |response, filepath, filestat|
    response.headers.add("Cache-control", "public")
    response.headers.add("Cache-control", "max-age=31557600")
    response.headers.add("Cache-control", "s-max-age=31557600")
    response.headers.add("Content-Size", filestat.size.to_s)
  end

  get "/barcode" do |env|
    render "src/views/index.ecr"
  end

  post "/barcode" do |env|
    env.response.content_type = "application/json"
    upc = env.params.json["upc"].as(String)

    uri = URI.parse("https://api.upcitemdb.com/prod/trial/lookup")
    query = {"upc" => upc}.to_json
    request = HTTP::Client.post(uri, 
                                headers: HTTP::Headers{"content-type" => "application/json"}, 
                                body: query
                                )

    response = request.body
    puts response
    {title: JSON.parse(response)["items"][0]["title"], image: JSON.parse(response)["items"][0]["images"][0] }.to_json
  end

end
Kemal.run(PORT)
