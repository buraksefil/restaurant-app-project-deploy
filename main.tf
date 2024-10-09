provider "aws" {
    region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket         = "burak-terraform-state-bucket"
    key            = "terraform/state/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-table"
  }
  
}

resource "aws_vpc" "restaurant_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
      Name = "restaurant_vpc"
  }  
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id = aws_vpc.restaurant_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
      Name = "public_subnet_1"
  }  
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id = aws_vpc.restaurant_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags = {
      Name = "private_subnet_1"
  }  
}

resource "aws_internet_gateway" "restaurant_igw" {
  vpc_id = aws_vpc.restaurant_vpc.id
  tags = {
      Name = "restaurant_igw"
  }  
}

resource "aws_eip" "nat_eip" {
    domain = "vpc"
    tags = {
      Name = "nat_eip"
  }  
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id = aws_subnet.public_subnet_1.id
  tags = {
      Name = "nat_gateway"
  }  
}

resource "aws_route_table" "public_rt" {
    vpc_id = aws_vpc.restaurant_vpc.id
    
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.restaurant_igw.id
    }
    tags = {
      Name = "public_rt"
  }  
}

resource "aws_route_table" "private_rt" {
    vpc_id = aws_vpc.restaurant_vpc.id
    
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_nat_gateway.nat_gateway.id
    }
    tags = {
      Name = "private_rt"
  }  
}

resource "aws_route_table_association" "public_association" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

# Associate private subnet with the private route table
resource "aws_route_table_association" "private_association" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_security_group" "web_sg" {
    vpc_id = aws_vpc.restaurant_vpc.id
    
    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"] # Bu kısmı kendi IP adresinize kısıtlayabilirsiniz
            # Örneğin sadece sizin IP adresiniz:
            # cidr_blocks = ["YOUR_IP/32"]
        }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    tags = {
      Name = "web-sg"
  }  
}

resource "aws_instance" "aut_service" {
  ami = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.public_subnet_1.id
  associate_public_ip_address = true
  security_groups = [aws_security_group.web_sg.id]
  key_name = "restaurant_key"
    
  tags = {
    Name = "auth-service"
  }  
}

resource "aws_instance" "discount_service" {
  ami = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.public_subnet_1.id
  associate_public_ip_address = true
  security_groups = [aws_security_group.web_sg.id]
  key_name = "restaurant_key"
    
  tags = {
    Name = "discount-service"
  }  
}

resource "aws_instance" "item_service" {
  ami = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.public_subnet_1.id
  associate_public_ip_address = true
  security_groups = [aws_security_group.web_sg.id]
  key_name = "restaurant_key"
    
  tags = {
    Name = "item-service"
  }  
}

resource "aws_instance" "client_service" {
  ami = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.public_subnet_1.id
  associate_public_ip_address = true
  security_groups = [aws_security_group.web_sg.id]
  key_name = "restaurant_key"
    
  tags = {
    Name = "client-service"
  }  
}

resource "aws_instance" "haproxy_service" {
  ami = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.public_subnet_1.id
  associate_public_ip_address = true
  security_groups = [aws_security_group.web_sg.id]
  key_name = "restaurant_key"
    
  tags = {
    Name = "haproxy-service"
  }  
}


resource "aws_launch_template" "app_launch_template" {
  name_prefix                 = "app-launch-template"
  image_id                    = "ami-0866a3c8686eaeeba" 
  instance_type               = "t2.micro"
  key_name                    = "restaurant_key"
  vpc_security_group_ids      = [aws_security_group.web_sg.id]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "app_asg" {
  desired_capacity     = 2
  max_size             = 5
  min_size             = 1
  vpc_zone_identifier  = [aws_subnet.public_subnet_1.id]

  launch_template {
    id      = aws_launch_template.app_launch_template.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "app-instance"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "scale_out" {
  name                   = "scale-out"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app_asg.name
}

resource "aws_autoscaling_policy" "scale_in" {
  name                   = "scale-in"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app_asg.name
}

resource "aws_cloudwatch_log_group" "app_log_group" {
  name              = "/app/logs"
  retention_in_days = 7
}

resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "cpu_high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 75
  alarm_actions       = ["arn:aws:sns:us-east-1:911167887716:alarm-notifications"]
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app_asg.name
  }
}